import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import { getUserReservations, getReservation, createReservation, updateReservation, deleteReservation, getCoWorkingSpaceReservations, } from "../controllers/reservations.js";
const router = Router();
router.route("/").get(readToken, protect, getUserReservations).post(readToken, protect, createReservation);
router
    .route("/:id")
    .get(readToken, protect, getReservation)
    .put(readToken, protect, updateReservation)
    .delete(readToken, protect, deleteReservation);
router.route("/coworkingSpaces/:id").get(readToken, protect, getCoWorkingSpaceReservations);
export default router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - coworkingSpace
 *         - startDate
 *         - endDate
 *         - personCount
 *         - approvalStatus
 *         - createdAt
 *       properties:
 *         user:
 *           type: string
 *           description: user id
 *         coworkingSpace:
 *           type: string
 *           description: co-working space id
 *         startDate:
 *           type: date
 *           description: Begin date
 *         endDate:
 *           type: date
 *           description: End date
 *         personCount:
 *           type: integer
 *           description: Amount of people
 *         approvalStatus:
 *           type: string
 *           description: Reservation status
 *         createdAt:
 *           type: date
 *           description: Time this account was created
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the reservation
 *           example: 680f6a5d3d2cec585c50789e
 *         __v:
 *           type: integer
 *           description: Auto-generated number
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the reservation
 *           example: 680f6a5d3d2cec585c50789e
 *       example:
 *         user: 67eb8d8645740e59ebef42d6
 *         coworkingSpace: 67c1a7e7ca65533d7eb9900c
 *         startDate: 2025-04-01T06:53:58.727Z
 *         endDate: 2025-04-12T06:53:58.727Z
 *         personCount: 4
 *         approvalStatus: pending
 *         createdAt: 2025-04-01T06:53:58.727Z
 *         _id: 680f9808f1bd1b7c72d13a3c
 *         __v: 0
 *         id: 680f9808f1bd1b7c72d13a3c
 */
/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: The reservation managing API
 */
/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Returns the list of all the reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: The list of the reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorize to access this route
 */
/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get the reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     responses:
 *       200:
 *         description: The reservation description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorize to access this route
 *       404:
 *         description: The reservation was not found
 */
/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: The reservation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Reservation limit of 3 reached
 *       401:
 *         description: Not authorize to access this route
 */
/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: The reservation was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorize to access this route
 *       404:
 *         description: The reservation was not found
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Remove the reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 *
 *     responses:
 *       200:
 *         description: The reservation was deleted
 *       401:
 *         description: Not authorize to access this route
 *       404:
 *         description: The reservation was not found
 */
/**
 * @swagger
 * /reservations/coworkingSpaces/{id}:
 *   get:
 *     summary: Get the reservation by id of co-working space
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The co-working space id
 *     responses:
 *       200:
 *         description: The co-working space reservation description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Not authorize to access this route
 *       404:
 *         description: The co-working space was not found
 */
