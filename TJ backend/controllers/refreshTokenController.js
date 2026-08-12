const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({
        refreshTokens: refreshToken
    }).exec();

    if (!foundUser) {
        return res.sendStatus(403);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        email: foundUser.email,
                        id: foundUser._id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                accessToken,
                user: {
                    id: foundUser._id,
                    username: foundUser.name,
                    email: foundUser.email,
                },
            });
        }
    );
};

module.exports = { handleRefreshToken };