import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import initialRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __dirname = dirname(__filename);
const app = express();
const Port = process.env.PORT || 8080;
const corsOption = {
  origin: [process.env.FONTEND_URL, process.env.ADMIN_URL],
  credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));
initialRoutes(app);

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected");
    app.listen(Port, () => {
      console.log("Server is running", Port);
    });
  } catch (error) {
    console.log(error.message);
  }
};
connectDatabase();
