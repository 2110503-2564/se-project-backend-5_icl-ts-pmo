import User from "../models/User.js";
import { RequestHandler } from "express";
import dbConnect from "../dbConnect.js";
import { parse } from "path";

export const getUser: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error(error);
  }
  res.status(500).json({ success: false });
};

export const getUsers: RequestHandler = async (req, res) => {
  const limit = parseInt(req.query.limit as string, 10) || 25;
  const page = parseInt(req.query.page as string, 10) || 1;
  await dbConnect();
  try {
    const total = await User.countDocuments();
    const users = await User.aggregate([{$skip: (page-1)*limit}, {$limit: limit},{$project: {password: 0}}]);
    if (!users) {
      res.status(400).json({success: false});
    }
    res.status(200).json({success: true, count: users.length, total, users});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false});
  }
}
