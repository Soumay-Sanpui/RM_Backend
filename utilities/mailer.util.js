import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.verify();

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check credentials.');
    }
    if (error.code === 'ESOCKET') {
      throw new Error('Network error occurred while sending email.');
    }
    if (error.code === 'EENVELOPE') {
      throw new Error('Invalid recipient email address.');
    }

    throw new Error(`Failed to send email: ${error.message}`);
  }
};
