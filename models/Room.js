import mongoose, { Schema } from "mongoose";
const roomSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    desc: { type: String, required: true },
    roomNumbers: [{ type: Number, required: true }],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
