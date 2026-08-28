const User = require('../model/User');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({
        refreshTokens: refreshToken
    }).exec();

    if (!foundUser) {
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.sendStatus(204);
    }

    foundUser.refreshTokens = foundUser.refreshTokens.filter(
        token => token !== refreshToken
    );

    await foundUser.save();

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'Lax'
    });

    return res.sendStatus(204);
};

module.exports = { handleLogout };