import Hotel from "../models/Hotel";
import Transaction from "../models/Transaction";
import createError from "../utils/createError";

export const getHotels = async (req, res, next) => {
  try {
    const {
      city,
      dateStart = new Date(),
      dateEnd = new Date(),
      maxPeople = 1,
      numberOfRooms = 1,
      min = 1,
      max = 999,
      isAdmin = false,
    } = req.query;

    if (isAdmin) {
      const hotels = await Hotel.find().sort({ createdAt: -1 });
      return res.status(200).send(hotels);
    }
    // tìm kiếm theo thành phố và giá
    let hotels = await Hotel.find({ city: new RegExp(city, "i"), cheapestPrice: { $gte: +min, $lte: +max } }).populate(
      "rooms"
    );

    // tìm kiếm theo max people, nếu tồn tại ít nhất 1 phòng hợp lệ thì trả về true
    hotels = hotels.filter((hotel) => {
      return hotel.rooms.some((roomType) => roomType.maxPeople >= maxPeople);
    });

    // tìm kiếm theo ngày tháng và số phòng tối đa (1 khách sạn hợp lệ khi có tổng số phòng trống >= numberOfRooms, 1 phòng được coi là trống khi nó không có giao dịch trong khoảng [startDate,endDate])

    let availableHotels = [];

    // duyệt qua từng khách sạn
    for (const hotel of hotels) {
      const numberAvailableRooms = new Set();

      // duyệt qua từng loại phòng của khách sạn
      for (const roomType of hotel.rooms) {
        // bên trong từng loại phòng tìm tất cả các giao dịch diễn ra trong khoảng [startDate,endDate] (các phòng này là không hợp lệ)
        const transactions = await Transaction.find({
          hotel: hotel._id,
          room: { $in: roomType.roomNumbers },
          $or: [
            { dateStart: { $gte: new Date(dateStart), $lte: new Date(dateEnd) } },
            { dateEnd: { $gte: new Date(dateStart), $lte: new Date(dateEnd) } },
            { dateStart: { $lte: new Date(dateStart) }, dateEnd: { $gte: new Date(dateEnd) } },
          ],
        });

        // sử dụng flat để gom mảng 2 chiều thành mảng 1 chiều
        const bookedRooms = transactions.map((tr) => tr.room).flat();

        // filter ra các phòng hợp lệ
        const availableRooms = roomType.roomNumbers.filter((room) => !bookedRooms.includes(room));

        // đưa phòng hợp lệ vào new Set() vì 1 phòng có thể thuộc nhiều loại phòng dẫn tới trùng lặp
        availableRooms.forEach((room) => numberAvailableRooms.add(room));
      }

      // nếu số phòng hợp lệ >= số phòng khách đặt thì trả về khách sạn
      if (numberAvailableRooms.size >= numberOfRooms) availableHotels.push(hotel);
    }
    res.status(200).send(availableHotels);
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(200).send({ hotel, message: "Hotel created" });
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) return next(createError(400, "Bad request"));
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) return next(createError(404, "Hotel not found"));
    res.status(200).send(hotel._doc);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) return next(createError(400, "Bad request"));
    const hotel = await Hotel.findByIdAndUpdate(hotelId, { $set: req.body }, { new: true });
    if (!hotel) return next(createError(404, "Hotel not found"));
    res.status(200).send({ hotel, message: "Hotel updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) return next(createError(400, "Bad request"));
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return next(createError(404, "Hotel not found"));

    const transactions = await Transaction.find({ hotel: hotelId }).lean();
    if (transactions.length !== 0) return next(createError(400, "Hotel has associated transactions"));
    await Hotel.deleteOne({ _id: hotelId });
    res.status(200).send({ message: "Hotel and associated rooms deleted" });
  } catch (error) {
    next(error);
  }
};

export const countByCity = async (req, res, next) => {
  try {
    const cities = ["Ha Noi", "Ho Chi Minh", "Da Nang"];
    const counts = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: { $regex: new RegExp(city, "i") } });
      })
    );

    res.status(200).send(counts);
  } catch (error) {
    next(error);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const types = ["Hotel", "Apartments", "Resorts", "Villas", "Cabins"];
    const results = await Promise.all(
      types.map(async (type) => {
        const count = await Hotel.countDocuments({ type: { $regex: new RegExp(type, "i") } });
        return { type: type, count: count };
      })
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
export const getTopRate = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const topRates = await Hotel.find({}).sort({ rating: -1 }).limit(limit);
    res.status(200).send({ results: topRates });
  } catch (error) {
    next(error);
  }
};

export const getHotelRooms = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
