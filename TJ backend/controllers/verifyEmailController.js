const User = require("../model/User");
const crypto = require("crypto");

const handleVerifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            message: "Verification token is required."
        });
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const foundUser = await User.findOne({
        emailVerificationToken: hashedToken,
    });

    if (!foundUser) {
        return res.status(400).json({
            message: "Invalid or expired verification link."
        });
    }

    if (
        !foundUser.emailVerificationExpires ||
        foundUser.emailVerificationExpires < Date.now()
    ) {
        return res.status(400).json({
            message: "Verification link has expired."
        });
    }

    foundUser.emailVerified = true;
    foundUser.emailVerificationToken = undefined;
    foundUser.emailVerificationExpires = undefined;

    await foundUser.save();

    return res.status(200).json({
        message: "Email verified successfully."
    });
};

module.exports = {
    handleVerifyEmail,
};