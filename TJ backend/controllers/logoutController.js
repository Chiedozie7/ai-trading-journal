const User = require('../model/User');

const handleLogout = async (req, res) => {
    // on client, also delete the accessToken
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    // is refreshToken in db?
    const foundUser = await User.findOne({ refreshTokens: refreshToken }).exec();
    console.log(foundUser?.email);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
        return res.sendStatus(204);
    }

    //Delete refreshToken in db
    foundUser.refreshTokens =
        foundUser.refreshTokens.filter(
            token => token !== refreshToken
        );

    await foundUser.save();
    console.log(result);
    console.log(result.refreshToken);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })// secure: true - only serves on https
    res.sendStatus(204);
}
module.exports = { handleLogout }