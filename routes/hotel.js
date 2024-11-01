import { Router } from "express";
import * as ctrls from "../controllers";
import { verifyAdmin } from "../middlewares/verifyToken";

const routes = Router();
routes.get("/", ctrls.getHotels);
routes.post("/", verifyAdmin, ctrls.createHotel);
routes.get("/find/:hotelId", ctrls.getHotelById);
routes.put("/:hotelId", verifyAdmin, ctrls.updateHotel);
routes.delete("/:hotelId", verifyAdmin, ctrls.deleteHotel);

routes.get("/countByCity", ctrls.countByCity);
routes.get("/countByType", ctrls.countByType);
routes.get("/top-rate", ctrls.getTopRate);
routes.get("/room/:hotelId", ctrls.getHotelRooms);

export default routes;
