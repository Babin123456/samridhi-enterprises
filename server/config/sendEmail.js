import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@samridhienterprises.com";
const SENDER_NAME = process.env.SENDER_NAME || "Samridhi Enterprises";

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    if (process.env.BREVO_API_KEY === "dummy") {
      if (process.env.NODE_ENV !== "production") {
        console.log("⚠️ Bypassing email send because BREVO_API_KEY is 'dummy'.");
      }
      return true;
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: SENDER_EMAIL,
          name: SENDER_NAME,
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
