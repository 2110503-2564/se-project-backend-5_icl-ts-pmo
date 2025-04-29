import { Router } from "express";
import { getUser } from "../controllers/users.js";

const router = Router();

router.get("/:id", getUser);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
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
 *         telephone_number:
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
 *         telephone_number: "0123456789"
 *         email: Crymai@gmail.com
 *         role: user
 *         createdAt: 2025-04-28T11:45:33.457Z
 *         __v: 0
 *         id: 680f6a5d3d2cec585c50789e
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       404:
 *         description: The user was not found
 */
