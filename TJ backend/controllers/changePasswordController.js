const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleChangePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: "Current and new password are required.",
        });
    }

    const foundUser = await User.findById(
        req.id
    ).exec();

    if (!foundUser) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(
        currentPassword,
        foundUser.password
    );

    if (!match) {
        return res.status(401).json({
            message: "Current password is incorrect.",
        });
    }

    foundUser.password = await bcrypt.hash(
        newPassword,
        10
    );

    const refreshToken = jwt.sign(
        {
            email: foundUser.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1D",
        }
    );

    foundUser.refreshTokens = [refreshToken];

    await foundUser.save();
    const updatedUser = await User.findById(foundUser._id);

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        message: "Password updated successfully.",
    });
};

module.exports = {
    handleChangePassword,
};