export const sendEmail = async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        // In a real application, you would use Nodemailer or an email provider API like SendGrid/AWS SES here
        console.log(`[EMAIL DISPATCHED] To: ${to} | Subject: ${subject} | Body length: ${body?.length}`);

        res.json({ message: 'Email sent successfully', status: 'success' });
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ error: error.message || "Failed to send email" });
    }
};
