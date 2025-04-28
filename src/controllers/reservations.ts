import { RequestHandler, Response } from "express";
import mongoose from "mongoose";
import dbConnect from "../dbConnect.js";
import CoworkingSpace, { CoworkingSpaceType } from "../models/CoworkingSpace.js";
import { UserType } from "../models/User.js";
import Reservation, { ReservationType } from "../models/Reservation.js";

// function checkPermission(
//   user: Session["user"],
//   reservation: Omit<ReservationType, "coworkingSpace"> & { coworkingSpace: CWS }
// ) {
//   return (
//     reservation.user === user.id || user.role === "admin" || user.id === reservation.coworkingSpace.owner
//   );
// }

export const getUserReservations: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const result = (
      await Reservation.aggregate<
        | {
            data: (Omit<ReservationType, "coworkingSpace"> & { coworkingSpace: CoworkingSpaceType })[];
            total: number;
          }
        | undefined
      >([
        { $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user!.id) } },
        {
          $lookup: {
            from: "coworkingspaces",
            localField: "coworkingSpace",
            foreignField: "_id",
            // pipeline: [{ $match: cwsFilter }],
            as: "coworkingSpace",
          },
        },
        { $match: { coworkingSpace: { $not: { $size: 0 } } } },
        { $set: { coworkingSpace: { $arrayElemAt: ["$coworkingSpace", 0] } } },
        {
          $set: {
            _id: { $toString: "$_id" },
            user: { $toString: "$user" },
            "coworkingSpace._id": { $toString: "$coworkingSpace._id" },
            "coworkingSpace.owner": { $toString: "$coworkingSpace.owner" },
          },
        },
        { $group: { _id: null, data: { $push: "$$ROOT" }, total: { $count: {} } } },
        { $project: { _id: 0, data: 1, total: 1 } },
        // { $project: { _id: 0, data: { $slice: ["$data", page * limit, limit] }, total: 1 } },
      ])
    )[0];
    res.status(200).json({
      success: true,
      data: result?.data || [],
      count: result?.data.length || 0,
      total: result?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const getCoWorkingSpaceReservations: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const coworkingSpace = await CoworkingSpace.findById(req.params.id);
    if (coworkingSpace) {
      const result = (
        await Reservation.aggregate<
          { data: (Omit<ReservationType, "user"> & { user: UserType })[]; total: number } | undefined
        >([
          {
            $match: {
              coworkingSpace: mongoose.Types.ObjectId.createFromHexString(req.params.id),
              ...(req.user!.role != "admin" && req.user!.id != coworkingSpace.owner.toHexString()
                ? { user: mongoose.Types.ObjectId.createFromHexString(req.user!.id) }
                : {}),
            },
          },
          { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
          { $set: { user: { $arrayElemAt: ["$user", 0] } } },
          {
            $set: {
              _id: { $toString: "$_id" },
              "user._id": { $toString: "$user._id" },
              coworkingSpace: { $toString: "$coworkingSpace" },
            },
          },
          { $group: { _id: null, data: { $push: "$$ROOT" }, total: { $count: {} } } },
          { $project: { _id: 0, data: 1, total: 1 } },
          // { $project: { _id: 0, data: { $slice: ["$data", page * limit, limit] }, total: 1 } },
        ])
      )[0];
      res.status(200).json({
        success: true,
        data: result?.data || [],
        count: result?.data.length || 0,
        total: result?.total || 0,
      });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const getReservation: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const reservation = await getPopulatedReservation(req.params.id, res);
    if (reservation && checkPermission(reservation, req.user!, res)) {
      res.status(200).json({ success: true, data: reservation });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const createReservation: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const existedReservations = await Reservation.countDocuments({ user: req.user!.id });
    if (existedReservations >= 3 && req.user!.role !== "admin") {
      res.status(400).json({ success: false, message: "Reservation limit of 3 reached" });
      return;
    }
    const reservation = await Reservation.create({ ...req.body, user: req.user!.id });
    if (reservation) {
      res.status(200).json({ success: true, data: reservation });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const updateReservation: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const reservation = await getPopulatedReservation(req.params.id, res);
    if (reservation && checkPermission(reservation, req.user!, res)) {
      // ! Vulnerability
      if (reservation.approvalStatus == "pending") {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (updatedReservation) {
          res.status(200).json({ success: true, data: updatedReservation });
        } else {
          res.status(500).json({ success: false });
        }
      } else {
        res.status(400).json({ success: false });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const deleteReservation: RequestHandler = async (req, res) => {
  try {
    const reservation = await getPopulatedReservation(req.params.id, res);
    if (reservation && checkPermission(reservation, req.user!, res)) {
      const result = await reservation.deleteOne();
      if (result.acknowledged) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ success: false });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

function checkPermission(
  reservation: ReservationType & { coworkingSpace: CoworkingSpaceType },
  user: UserType,
  res: Response
) {
  if (
    user.role == "admin" ||
    user.id == reservation.coworkingSpace.owner.toHexString() ||
    user.id == reservation.user.toHexString()
  ) {
    return true;
  }
  res.status(403).json({ success: false });
  return false;
}

async function getPopulatedReservation(id: string, res: Response) {
  const reservation = (await Reservation.findById(id).populate("coworkingSpace")) as ReservationType & {
    coworkingSpace: CoworkingSpaceType;
  };
  if (reservation) return reservation;
  res.status(404).json({ success: false });
  return false;
}
