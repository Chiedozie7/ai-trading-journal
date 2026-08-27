const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const NewUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }

    const normalizedEmail = email.toLowerCase();

    const duplicate = await User.findOne({
        email: normalizedEmail
    }).exec();

    if (duplicate) {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    if (password.length < 4) {
        return res.status(400).json({
            message: "Password must be at least 4 characters long"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedVerificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        const verificationExpires =
            Date.now() + 15 * 60 * 1000;

        const result = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            emailVerified: false,
            emailVerificationToken: hashedVerificationToken,
            emailVerificationExpires: verificationExpires,
        });

        const verificationLink =
            `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        await sendEmail({
            to: result.email,
            subject: "Verify Your TradeLedger Account",
            html: `
                <h2>Welcome to TradeLedger</h2>

                <p>
                    Hi ${result.name},
                </p>

                <p>
                    Thanks for creating your TradeLedger account.
                    Please verify your email address to activate your account.
                </p>

                <p>
                    <a href="${verificationLink}">
                        Verify My Email
                    </a>
                </p>

                <p>
                    This verification link expires in 15 minutes.
                </p>
            `,
        });

        return res.status(201).json({
            success: true,
            message:
                "Account created. Please check your email to verify your account."
        });

    } catch (err) {
        console.error("Registration Error:", err);

        return res.status(500).json({
            message: "Unable to create account."
        });
    }
};

module.exports = { NewUser };