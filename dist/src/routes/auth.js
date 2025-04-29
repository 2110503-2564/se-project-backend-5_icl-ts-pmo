import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import { register, login, me, logout } from "../controllers/auth.js";
import { checkBan } from "../controllers/banIssue.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", readToken, protect, me);
router.get("/checkBan", readToken, protect, checkBan);
export default router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the account
 *           example: 680f6a5d3d2cec585c50789e
 *         name:
 *           type: string
 *           description: Username
 *         phone:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           description: Email address
 *         role:
 *           type: string
 *           description: User role
 *         createdAt:
 *           type: date
 *           description: Time this account was created
 *         __v:
 *           type: integer
 *           description: Auto-generated number
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the account
 *           example: 680f6a5d3d2cec585c50789e
 *       example:
 *         _id: 680f6a5d3d2cec585c50789e
 *         name: Crymai
 *         phone: "0123456789"
 *         email: Crymai@gmail.com
 *         role: user
 *         createdAt: 2025-04-28T11:45:33.457Z
 *         __v: 0
 *         id: 680f6a5d3d2cec585c50789e
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: Crymai
 *               email: Crymai@gmail.com
 *               phone: "0123456789"
 *               password: "123456"
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 _id: 680f6a5d3d2cec585c50789e
 *                 name: Crymai
 *                 email: Crymai@gmail.com
 *                 role: user
 *       400:
 *         description: Invalid request body
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               email: Crymai@gmail.com
 *               password: "123456"
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 _id: 680f6a5d3d2cec585c50789e
 *                 name: Crymai
 *                 email: Crymai@gmail.com
 *                 role: user
 *       400:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout from application
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logout
 */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the user information by token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The user description by token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       401:
 *         description: Not authorize to access this route
 */
/**
 * @swagger
 * /auth/checkBan:
 *   get:
 *     summary: Get the user ban status by token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The user ban status by token
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 isBanned: false
 *       401:
 *         description: Not authorize to access this route
 */
