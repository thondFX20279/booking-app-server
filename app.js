const express = require("express");
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import initialRoutes from "./routes";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();
const app = express();
const http = require("http").Server(app);
global.__basename = __dirname;
const Port = process.env.PORT || 3001;
const corsOption = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
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
    http.listen(Port, () => {
      console.log("Server is running", Port);
    });
  } catch (error) {
    console.log(error.message);
  }
};
connectDatabase();
