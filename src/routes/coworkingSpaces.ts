import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import {
  createCoWorkingSpace,
  deleteCoWorkingSpace,
  getCoWorkingSpace,
  getCoworkingSpaceFrequency,
  getCoWorkingSpaces,
  getCoworkingSpaceTotalReservation,
  updateCoWorkingSpace,
} from "../controllers/coworkingSpace.js";

const router = Router();

router.route("/").get(readToken, getCoWorkingSpaces).post(readToken, protect, createCoWorkingSpace);
router
  .route("/:id")
  .get(readToken, getCoWorkingSpace)
  .put(readToken, protect, updateCoWorkingSpace)
  .delete(readToken, protect, deleteCoWorkingSpace);
router.route("/:id/frequency").get(readToken, protect, getCoworkingSpaceFrequency);
router.route("/:id/totalReservation").get(readToken, protect, getCoworkingSpaceTotalReservation);

export default router;

/**
 * @swagger
 * /co-working-spaces:
 *   post:
 *     summary: Create a new co-working-space
 *     tags: [CoWorkingSpaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorkingSpace'
 *     responses:
 *       201:
 *         description: The co-working-space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorkingSpace'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /co-working-spaces/{id}:
 *   delete:
 *     summary: Remove the co-working space by id
 *     tags: [CoWorkingSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The co-working-space id
 *
 *     responses:
 *       200:
 *         description: The co-working-space was deleted
 *       404:
 *         description: The co-working-space was not found
 */
