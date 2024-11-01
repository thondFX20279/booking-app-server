import Transaction from "../models/Transaction";
import createError from "../utils/createError.js";

export const getTransactions = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const transactions = await Transaction.find()
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("hotel")
      .populate("user")
      .lean();
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
// Create a new transaction
export const booked = async (req, res, next) => {
  try {
    const { userId, hotelId, room, dateStart, dateEnd, price, payment, status = "Booked" } = req.body;

    if (!userId || !hotelId || room.length === 0 || !dateStart || !dateEnd) return createError(400, "Missing payload");
    const newTransaction = new Transaction({
      user: userId,
      hotel: hotelId,
      room,
      dateStart: new Date(dateStart),
      dateEnd: new Date(dateEnd),
      price,
      payment: payment || "Credit Card",
      status,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    next(error);
  }
};

export const getUserTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return next(createError(400, "Bad requests"));

    const transactions = await Transaction.find({ user: userId }).populate("hotel").lean();

    res.status(200).send(transactions);
  } catch (error) {
    next(error);
  }
};
