import mongoose from "mongoose";

// One wishlist document per user, holding references to saved parts. Part
// details (name, price, images, stock) are populated on read, so a later edit
// or deletion of a part is reflected automatically — same approach as Cart.
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    items: [
      {
        part: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Part",
          required: true,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
