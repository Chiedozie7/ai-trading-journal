const User = require('../model/User');
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log("Cookies:", cookies);
    if (!cookies?.jwt) {
        console.log("No jwt cookie");
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    console.log("Refresh token from cookie:", refreshToken);

    //find refreshToken in database
    const foundUser = await User.findOne({ refreshToken }).exec();
     console.log("Found user:", foundUser?.email);
    if (!foundUser) {
        console.log("Refresh token not found in DB");
        return res.sendStatus(403)
    }; //forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
             console.log("JWT verify error:", err);
            console.log("Decoded:", decoded);
            
           if (err || foundUser.email !== decoded.email) {
                console.log("JWT verification failed");
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "id": foundUser._id,
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
            })
        }
    );
}
module.exports = { handleRefreshToken }