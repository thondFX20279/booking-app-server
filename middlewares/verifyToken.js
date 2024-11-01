import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies["access_token"];

    if (!token) return next(createError(401, "Not authenticated"));

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) return next(createError(403, "Token invalid"));
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.id) {
      next();
    } else {
      res.status(403).json("Access denied, user or admin privileges required");
    }
  });
};
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("Access denied, admin privileges required");
    }
  });
};
