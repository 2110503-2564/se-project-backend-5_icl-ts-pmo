import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import { getBanAppeals } from "../controllers/banAppeal.js";

const router = Router();

router.get("/banAppeals", readToken, protect, getBanAppeals);

export default router;
