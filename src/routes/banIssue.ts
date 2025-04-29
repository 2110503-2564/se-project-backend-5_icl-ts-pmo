import { Router } from "express";
import { protect, readToken, authorize } from "../middleware.js";
import {
  createBanIssue,
  getActiveBanIssues,
  getBanIssue,
  getUserBanIssues,
  resolveBanIssue,
} from "../controllers/banIssue.js";
import {
  createBanAppeal,
  getBanAppeal,
  createBanAppealComment,
  updateBanAppeal,
} from "../controllers/banAppeal.js";

const router = Router();

router.route("/").get(readToken, protect, getActiveBanIssues);

router
  .route("/:id")
  .get(readToken, protect, getBanIssue)
  .post(readToken, protect, createBanAppeal)
  .put(readToken, protect, authorize("admin"), resolveBanIssue);

router
  .route("/user/:id")
  .get(readToken, protect, getUserBanIssues)
  .post(readToken, protect, authorize("admin"), createBanIssue);

router
  .route("/:id/:appeal")
  .get(readToken, protect, getBanAppeal)
  .post(readToken, protect, createBanAppealComment)
  .put(readToken, protect, updateBanAppeal);

export default router;
