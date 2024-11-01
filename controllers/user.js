import User from "../models/User.js";
import createError from "../utils/createError.js";
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-username -password");
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
export const getCurrent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-username -password");
    if (!user) return next(createError(404, "User not found"));

    res.status(200).send({ user });
  } catch (error) {}
};
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-username -password");
    if (!user) return next(createError(404, "User not found"));

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true }).select(
      "-username -password"
    );
    if (!updatedUser) return next(createError(404, "User not found"));
    res.status(200).send({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return next(createError(404, "User not found"));
    res.status(200).send("User deleted");
  } catch (error) {
    next(error);
  }
};
