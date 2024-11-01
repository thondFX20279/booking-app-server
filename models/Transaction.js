import mongoose, { Schema } from "mongoose";
const transactionSchema = new Schema(
  {
    user: { type: Schema.Types.String, ref: "User", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room: [{ type: Number, required: true }],
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    price: { type: Number, required: true },
    payment: { type: String, required: true, enum: ["Credit Card", "Cash"] },
    status: { type: String, required: true, enum: ["Booked", "Checkin", "Checkout"] },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
