const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "TradeLedger <noreply@tradeledger.cv>",
            to,
            subject,
            html,
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Email Error:", error);
        throw error;
    }
};

module.exports = sendEmail;