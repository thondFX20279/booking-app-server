import express from "express";
import * as ctrls from "../controllers";

const router = express();
router.get("/", ctrls.getTransactions);
router.get("/:userId", ctrls.getUserTransactions);
router.post("/", ctrls.booked);
export default router;
