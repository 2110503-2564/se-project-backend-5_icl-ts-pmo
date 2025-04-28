import { Router } from "express";
import { authorize, protect, readToken } from "../middleware.js";
import { getUsers } from "../controllers/users.js";

const router = Router();

router.route("/").get(readToken, protect, authorize("admin"), getUsers);

export default router;