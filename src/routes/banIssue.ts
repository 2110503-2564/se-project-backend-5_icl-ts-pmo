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

/**
 * @swagger
 * components:
 *   schemas:
 *     banIssue:
 *       type: object
 *       required:
 *         - user
 *         - admin
 *         - title
 *         - description
 *         - endDate
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the ban issue
 *         user:
 *           type: string
 *           description: Target user id
 *         admin:
 *           type: string
 *           description: Admin id
 *         title:
 *           type: string
 *           description: Ban title (max 50 length)
 *         description:
 *           type: string
 *           description: Description why he got ban
 *         createdAt:
 *           type: date
 *           description: Ban begin
 *         endDate:
 *           type: date
 *           description: Ban end
 *         isResolved:
 *           type: boolean
 *           description: Ban status
 *         resolvedAt:
 *           type: date
 *           description: When this ban resolved
 *         __v:
 *           type: integer
 *           description: Auto-generated number
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the ban issue
 */
/**
 * @swagger
 * tags:
 *   name: BanIssue
 *   description: The ban issue managing API
 */
/**
 * @swagger
 * /banIssues/{id}:
 *   get:
 *     summary: Get the ban issue by id 
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *     responses:
 *       200:
 *         description: The ban issue description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
 */
/**
 * @swagger
 * /banIssues/{id}:
 *   post:
 *     summary: Create a ban appeal to the ban issue id
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/banIssue'
 *     responses:
 *       201:
 *         description: The ban appeal was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
 *       500:
 *         description: Some server error
*/
/**
 * @swagger
 * /banIssues/{id}:
 *   put:
 *     summary: Resolve ban issue by id
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/banIssue'
 *     responses:
 *       200:
 *         description: The ban was successfully resolved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
 *       500:
 *         description: Some server error
*/
/**
 * @swagger
 * /banIssues/user/{id}:
 *   get:
 *     summary: Get the ban issue by user id 
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The ban issue description of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
*/
/**
 * @swagger
 * /banIssues/user/{id}:
 *   post:
 *     summary: Create a ban issue to the user id
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/banIssue'
 *     responses:
 *       201:
 *         description: The ban issue was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
 *       500:
 *         description: Some server error
*/
/**
 * @swagger
 * /banIssues/{id}/{appeal}:
 *   get:
 *     summary: Get the ban appeal of the ban issue id by appeal id 
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *       - in: path
 *         name: appeal
 *         schema:
 *           type: string
 *         required: true
 *         description: The appeal id
 *     responses:
 *       200:
 *         description: The ban appeal description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
*/
/**
 * @swagger
 * /banIssues/{id}/{appeal}:
 *   post:
 *     summary: Create a ban appeal comment to the ban appeal id in the ban issue id
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *       - in: path
 *         name: appeal
 *         schema:
 *           type: string
 *         required: true
 *         description: The appeal id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/banIssue'
 *     responses:
 *       201:
 *         description: The ban appeal was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
 *       500:
 *         description: Some server error
*/
/**
 * @swagger
 * /banIssues/{id}/{appeal}:
 *   put:
 *     summary: Update ban appeal in the ban issue id by appeal id
 *     tags: [BanIssue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ban id
 *       - in: path
 *         name: appeal
 *         schema:
 *           type: string
 *         required: true
 *         description: The appeal id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/banIssue'
 *     responses:
 *       200:
 *         description: The ban appeal was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/banIssue'
 *       500:
 *         description: Some server error
*/