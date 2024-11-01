import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "Hotel",
        "hotel",
        "Apartments",
        "apartments",
        "Resorts",
        "resorts",
        "Villas",
        "villas",
        "Cabins",
        "cabins",
      ],
    },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    photos: { type: [String] },
    desc: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    cheapestPrice: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    title: { type: String, require: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }], // Relationship to Room
  },
  { timestamps: true }
);
hotelSchema.pre("remove", async function (next) {
  // Remove all rooms that reference this hotel
  const Room = mongoose.model("Room");
  await Room.deleteMany({ _id: { $in: this.rooms } });
  next();
});

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
