import express from "express";

import authRouter from "./authentication.routes";

const router = express.Router();

router.use("/auth", authRouter);

export default router;
