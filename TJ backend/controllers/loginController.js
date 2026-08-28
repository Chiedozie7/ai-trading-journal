const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();


    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required' });
    const foundUser = await User.findOne({ email: normalizedEmail }).exec();
    if (!foundUser) return res.status(401).json({ 'message': 'Invalid email' }); //Unauthorized
    if (!foundUser.emailVerified) {
        return res.status(403).json({
            message: "Please verify your email before logging in.",
        });
    }
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        //create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "id": foundUser._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1D' }
        );

        // Migrate old users to the new refreshTokens array
        if (!Array.isArray(foundUser.refreshTokens)) {
            foundUser.refreshTokens = [];
        }
        // Saving refreshToken with current user
        foundUser.refreshTokens.push(refreshToken);
        await foundUser.save();

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        }); //for testing purposes with ThunderClient, comment out "secure:true." Add it back when working with Chrome
        res.json({
            accessToken,
            user: {
                _id: foundUser._id,
                username: foundUser.name,
                email: foundUser.email
            }
        })
    } else {
        res.sendStatus(401);;
    }
}

module.exports = { handleLogin };