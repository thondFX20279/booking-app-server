import Room from "../models/Room.js";
import createError from "../utils/createError.js";
import Hotel from "../models/Hotel.js";
import Transaction from "../models/Transaction.js";
export const getAllRooms = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;
    const rooms = await Room.find().limit(limit).sort({ createdAt: -1 });
    res.status(200).send(rooms);
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const room = new Room(req.body);
    await room.save();
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return next(createError(404, "Hotel not found"));
    hotel.rooms.push(room);
    await hotel.save();
    res.status(200).send({ room });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return next(createError(404, "Room not found"));
    res.status(200).send(room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findByIdAndUpdate(roomId, { $set: req.body }, { new: true });
    if (!room) return next(createError(404, "Room not found"));
    res.status(200).send({ room });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Tìm phòng theo roomId
    const room = await Room.findById(roomId);
    if (!room) {
      return next(createError(404, "Room not found"));
    }

    // Tìm tất cả các khách sạn chứa roomId
    const hotels = await Hotel.find({ rooms: roomId });

    // Kiểm tra nếu phòng có giao dịch nào đang diễn ra
    for (const hotel of hotels) {
      const transactions = await Transaction.find({
        hotel: hotel._id,
        room: { $in: room.roomNumbers }, // Kiểm tra trong roomNumbers của phòng
        dateEnd: { $gte: Date.now() }, // Chỉ kiểm tra các giao dịch chưa kết thúc
      });

      if (transactions.length > 0) {
        return next(createError(400, "Delete Failed. Room is currently in use"));
      }
    }

    // Nếu không có giao dịch nào, tiến hành xóa liên kết room khỏi các khách sạn
    for (const hotel of hotels) {
      hotel.rooms.pull(roomId);
      await hotel.save(); // Lưu lại sau khi xóa room khỏi danh sách
    }

    // Xóa room khỏi database
    await Room.findByIdAndDelete(roomId);

    res.status(204).send({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAvailableRooms = async (req, res, next) => {
  const { hotelId } = req.params;
  const { dateStart = new Date(), dateEnd = new Date() } = req.query;

  const hotel = await Hotel.findById(hotelId).populate("rooms");

  if (!hotel) return next(createError(404, "Hotel not found"));
  const transactions = await Transaction.find({
    hotel: hotelId,
    $or: [
      { dateStart: { $gte: new Date(dateStart), $lte: new Date(dateEnd) } },
      { dateEnd: { $gte: new Date(dateStart), $lte: new Date(dateEnd) } },
      { dateStart: { $lte: new Date(dateStart) }, dateEnd: { $gte: new Date(dateEnd) } },
      { dateStart: { $gte: new Date(dateStart) }, dateEnd: { $lte: new Date(dateEnd) } },
    ],
  });
  console.log(transactions);
  const bookedRooms = transactions.map((tr) => tr.room).flat();
  let availableRooms = await Promise.all(
    hotel.rooms.map(async (roomType) => {
      return {
        ...roomType._doc,
        roomNumbers: roomType.roomNumbers.filter((room) => !bookedRooms.includes(room)),
      };
    })
  );
  res.status(200).send(availableRooms);
};
