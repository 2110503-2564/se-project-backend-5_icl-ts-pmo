import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import { getBanAppeals } from "../controllers/banAppeal.js";

const router = Router();

router.get("/", readToken, protect, getBanAppeals);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - user
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the ban appeal
 *         user:
 *           type: string
 *           description: user id
 *         text:
 *           type: string
 *           description: comment text
 *         createdAt:
 *           type: string
 *           description: Time this comment was created
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     banAppeal:
 *       type: object
 *       required:
 *         - banIssue
 *         - description
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the ban appeal
 *         banIssue:
 *           type: string
 *           description: Ban issue id
 *         description:
 *           type: string
 *           description: Description
 *         createdAt:
 *           type: date
 *           description: Time this appeal was created
 *         resolveStatus:
 *           type: string
 *           enum: [pending, denied, resolved]
 *         resolvedAt:
 *           type: date
 *           description: Resolve date
 *         comment:
 *           $ref: '#/components/schemas/Comment'
 *         __v:
 *           type: integer
 *           description: Auto-generated number
 */
/**
 * @swagger
 * tags:
 *   name: BanAppeal
 *   description: The ban appeal managing API
 */
/**
 * @swagger
 * /banAppeals:
 *   get:
 *     summary: Returns the list of all the ban appeals
 *     tags: [BanAppeal]
 *     responses:
 *       200:
 *         description: The list of the ban appeal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/banAppeal'
 *       401:
 *         description: Not authorize to access this route
 */