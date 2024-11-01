import { Router } from "express";
import * as ctrls from "../controllers";
import { verifyAdmin, verifyUser, verifyToken } from "../middlewares/verifyToken";

const routes = Router();
routes.get("/", verifyAdmin, ctrls.getAllUsers);
routes.get("/me", verifyToken, ctrls.getCurrent);
routes.get("/:userId", verifyUser, ctrls.getUserById);
routes.put("/:userId", verifyUser, ctrls.updateUser);
routes.delete("/:userId", verifyAdmin, ctrls.deleteUser);

export default routes;
