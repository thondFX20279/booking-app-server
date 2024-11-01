import express from "express";
import * as ctrls from "../controllers/index.js";
import { verifyAdmin, verifyUser, verifyToken } from "../middlewares/verifyToken.js";

const routes = express.Router();
routes.get("/", verifyAdmin, ctrls.getAllUsers);
routes.get("/me", verifyToken, ctrls.getCurrent);
routes.get("/:userId", verifyUser, ctrls.getUserById);
routes.put("/:userId", verifyUser, ctrls.updateUser);
routes.delete("/:userId", verifyAdmin, ctrls.deleteUser);

export default routes;
