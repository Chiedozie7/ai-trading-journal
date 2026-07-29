const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require('../utils/sendEmail');

const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email)
        return res.status(400).json({ message: "Email is required." });

    const normalizedEmail = email.toLowerCase();

    const foundUser = await User.findOne({
        email: normalizedEmail,
    });

    if (!foundUser) {
        return res.status(200).json({
            message:
                "If an account with that email exists, a password reset link has been sent.",
        });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    foundUser.passwordResetToken = hashedToken;

    // Valid for 15 minutes
    foundUser.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await foundUser.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
        to: foundUser.email,
        subject: "Reset Your Password",
        html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to continue:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
    `,
    });

    return res.status(200).json({
        message:
            "If an account with that email exists, a password reset link has been sent.",
    });
};


const handleResetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({
            message: "Token and new password are required.",
        });
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const foundUser = await User.findOne({
        passwordResetToken: hashedToken,
    });

    if (!foundUser) {
        return res.status(400).json({
            message: "Invalid or expired reset token.",
        });
    }

    if (foundUser.passwordResetExpires < Date.now()) {
        return res.status(400).json({
            message: "Reset token has expired.",
        });
    }

    foundUser.password = await bcrypt.hash(password, 10);

    foundUser.passwordResetToken = undefined;
    foundUser.passwordResetExpires = undefined;

    // Log out all existing sessions
    foundUser.refreshToken = "";

    await foundUser.save();

    return res.status(200).json({
        message: "Password reset successful.",
    });
};

module.exports = {
    handleForgotPassword,
    handleResetPassword
};