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
