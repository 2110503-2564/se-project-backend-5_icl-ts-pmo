import { RequestHandler } from "express";
import dbConnect from "../dbConnect.js";
import CoworkingSpace from "../models/CoworkingSpace.js";
import Reservation from "../models/Reservation.js";

export const getCoWorkingSpaces: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const [total, coworkingSpaces] = await Promise.all([
      CoworkingSpace.countDocuments(),
      CoworkingSpace.find(),
    ]);
    res.status(200).json({
      success: true,
      total: total,
      count: coworkingSpaces.length,
      data: coworkingSpaces.map((e) => e.toObject()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const getCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
    if (coWorkingSpace) {
      res.status(200).json({ success: true, data: coWorkingSpace });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const createCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coworkingSpace = await CoworkingSpace.insertOne({ ...req.body, owner: req.user!.id });
    if (coworkingSpace) {
      res.status(201).json({ success: true, data: coworkingSpace });
      return;
    }
  } catch (error) {
    console.error(error);
  }
  res.status(500).json({ success: false });
};

export const updateCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coWorkingSpace = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });

    if (coWorkingSpace) {
      res.status(200).json({ success: true, data: coWorkingSpace });
    } else {
      res.status(404).json({ successs: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
    if (coWorkingSpace) {
      await Promise.all([
        CoworkingSpace.deleteOne({ _id: req.params.id }),
        Reservation.deleteMany({ coWorkingSpace: req.params.id }),
      ]);
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
