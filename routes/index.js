import { notFound, handleError } from "../middlewares/error";
import hotels from "./hotel";
import rooms from "./room";
import users from "./user";
import auth from "./auth";
import transactions from "./transaction";
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
