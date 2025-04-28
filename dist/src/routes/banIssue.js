import { Router } from "express";
import { protect, readToken, authorize } from "../middleware.js";
import { createBanIssue, getActiveBanIssues, getBanIssue, getUserBanIssues, resolveBanIssue, } from "../controllers/banIssue.js";
import { createBanAppeal, getBanAppeal, createBanAppealComment, updateBanAppeal, } from "../controllers/banAppeal.js";
const router = Router();
router
    .route("/")
    .get(readToken, protect, authorize("admin"), getActiveBanIssues)
    .post(readToken, protect, authorize("admin"), createBanIssue);
router
    .route("/:id")
    .get(readToken, protect, getBanIssue)
    .post(readToken, protect, createBanAppeal)
    .put(readToken, protect, authorize("admin"), resolveBanIssue);
router
    .route("/:id/:appeal")
    .get(readToken, protect, getBanAppeal)
    .post(readToken, protect, createBanAppealComment)
    .put(readToken, protect, updateBanAppeal);
router.post("/user/:id", readToken, protect, getUserBanIssues);
export default router;
