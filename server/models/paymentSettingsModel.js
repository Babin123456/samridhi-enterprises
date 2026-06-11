import mongoose from "mongoose";

// Single configuration document holding the store's manual-payment details
// (UPI ID + QR code) that the admin configures and customers see at checkout.
const paymentSettingsSchema = new mongoose.Schema(
  {
    upiId: { type: String, default: "" },
    qrImage: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentSettings", paymentSettingsSchema);
