import { notFound, handleError } from "../middlewares/error.js";
import hotels from "./hotel.js";
import rooms from "./room.js";
import users from "./user.js";
import auth from "./auth.js";
import transactions from "./transaction.js";
const initialRoutes = (app) => {
  // app.use("/api/auth");
  app.use("/api/hotels", hotels);
  app.use("/api/rooms", rooms);
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/transactions", transactions);
  app.use(notFound);
  app.use(handleError);
};
export default initialRoutes;
