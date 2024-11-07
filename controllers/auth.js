import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import createError from "../utils/createError.js";
export const register = async (req, res, next) => {
  try {
    const { username, password, fullName, phoneNumber, email, isAdmin = false } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = (await User.findOne({ email })) || (await User.findOne({ username }));

    if (user) return next(createError(422, "Username or Email existed"));
    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      phoneNumber,
      email,
      isAdmin,
    });

    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { isAdmin = false } = req.body;
    console.log("Received username:", username);
    console.log("Received password:", password);
    const user = await User.findOne({ username: req.body.username, isAdmin });
    if (!user) return next(createError(422, "Invalid username or password"));
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return next(createError(422, "Invalid username or password"));
    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
    const { password, ...otherDetails } = user._doc;
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      expires: new Date(Date.now() + 3600000 * 7),
    });
    res.status(200).send({ message: "Logged in successfully", user: otherDetails });
  } catch (error) {
    next(error);
  }
};
