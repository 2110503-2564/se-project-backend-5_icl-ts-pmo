import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import { getBanAppeals } from "../controllers/banAppeal.js";

const router = Router();

router.get("/", readToken, protect, getBanAppeals);

export default router;
