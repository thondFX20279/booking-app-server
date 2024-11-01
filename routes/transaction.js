import express from "express";
import * as ctrls from "../controllers/index.js";

const router = express.Router();
router.get("/", ctrls.getTransactions);
router.get("/:userId", ctrls.getUserTransactions);
router.post("/", ctrls.booked);
export default router;
