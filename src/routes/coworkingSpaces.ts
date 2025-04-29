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
 * components:
 *   schemas:
 *     CoWorkingSpace:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - address
 *         - district
 *         - subDistrict
 *         - province
 *         - postalcode
 *         - openTime
 *         - closeTime
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the co-working space
 *           example: 67c1c6e9bb57d2646f56d4a2
 *         name:
 *           type: string
 *           description: Co-working space name
 *         description:
 *           type: string
 *           description: Co-working space description
 *         address:
 *           type: string
 *           description: Street number
 *         district:
 *           type: string
 *           description: District name
 *         subDistrict:
 *           type: string
 *           description: Sub-district name
 *         province:
 *           type: string
 *           description: Province name
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         openTime:
 *           type: date
 *           description: Open time
 *         closeTime:
 *           type: date
 *           description: Close time 
 *         tel:
 *           type: string
 *           description: Telephone number
 *         owner:
 *           type: string
 *           description: Owner id
 *         picture:
 *           type: string
 *           description: Picture address
 *         __v:
 *           type: integer
 *           description: Auto-generated number
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the co-working space
 * 
 *       example:
 *         _id: 609bda561452242d88d36e37
 *         name: Happy Meal
 *         address: Buffalo
 *         province: Bangkok
 *         district: North Lincoln
 *         subDistrict: Lueilwitz Squares
 *         postalcode: 10110
 *         openTime: 2025-04-27T21:55:47.000Z
 *         closeTime: 2025-04-27T17:59:17.000Z
 *         tel: 023-218-7000
 *         owner: 680e00036a4cf8103db056af
 *         __v: 0
 *         id: 609bda561452242d88d36e37
 */
/**
 * @swagger
 * tags:
 *   name: Co-working spaces
 *   description: The co-working spaces managing API
 */
/**
 * @swagger
 * /coworkingSpaces:
 *   get:
 *     summary: Returns the list of all the co-working spaces
 *     tags: [Co-working spaces]
 *     responses:
 *       200:
 *         description: The list of the co-working spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CoWorkingSpace'
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /coworkingSpaces/{id}:
 *   get:
 *     summary: Get the co-working space by id
 *     tags: [Co-working spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The co-working space id
 *     responses:
 *       200:
 *         description: The co-working space description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorkingSpace'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /coworkingSpaces:
 *   post:
 *     summary: Create a new co-working space
 *     tags: [Co-working spaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorkingSpace'
 *     responses:
 *       201:
 *         description: The co-working space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorkingSpace'
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /coworkingSpaces/{id}:
 *   put:
 *     summary: Update a co-working space by id
 *     tags: [Co-working spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The co-working space id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorkingSpace'
 *     responses:
 *       200:
 *         description: The co-working space was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorkingSpace'
 *       404:
 *         description: The co-working space was not found
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /coworkingSpaces/{id}:
 *   delete:
 *     summary: Remove the co-working space by id
 *     tags: [Co-working spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The co-working space id
 *
 *     responses:
 *       200:
 *         description: The co-working space was deleted
 *       404:
 *         description: The co-working space was not found
 */
