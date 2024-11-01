import { Router } from "express";
import * as ctrls from "../controllers";
import { verifyAdmin } from "../middlewares/verifyToken";

const router = Router();

router.get("/", ctrls.getAllRooms);
router.get("/:roomId", ctrls.getRoomById);
router.get("/availableRooms/:hotelId", ctrls.getAvailableRooms);
router.post("/:hotelId", verifyAdmin, ctrls.createRoom);
// routes.put("/availability/:id", updateRoomAvailability);
router.put("/:roomId", verifyAdmin, ctrls.updateRoom);
router.delete("/:roomId", verifyAdmin, ctrls.deleteRoom);

export default router;
