import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    if (process.env.BREVO_API_KEY === "dummy") {
      return true;
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL || "noreply@samridhienterprises.com",
          name: process.env.SENDER_NAME || "Samridhi Enterprises",
        },
        to: [{ email: sendTo }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Error sending email to",
      sendTo,
      ":",
      error.response?.data?.message || error.message
    );
    return false;
  }
};

export default sendEmail;
