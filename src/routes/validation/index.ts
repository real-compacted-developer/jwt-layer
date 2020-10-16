import { Router } from "express";
import authAPI from "./auth";

const router = Router();

router.use("/auth", authAPI);

export default router;