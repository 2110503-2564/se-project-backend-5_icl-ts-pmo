import { RequestHandler } from "express";
import mongoose from "mongoose";
import dbConnect from "../dbConnect.js";
import BanIssue, { BanIssueType } from "../models/BanIssue.js";
import User, { UserType } from "../models/User.js";
import { BanAppealType } from "../models/BanAppeal.js";

export const ActiveBanFilter: mongoose.FilterQuery<BanIssueType> = {
  endDate: { $gt: new Date() },
  isResolved: false,
};

/**
 * "admin": System Admin (view, create, edit)
 *
 * "target": Ban issue's target User (view)
 *
 * "user": Other User
 */
type BanIssuePrivilege = "admin" | "target" | "user";
function getPrivilege(
  banIssue: Omit<Omit<BanIssueType, "user">, "admin"> & { user: UserType; admin: UserType },
  user: UserType
): BanIssuePrivilege {
  return user.id == banIssue.user._id.toHexString() ? "target" : user.role == "admin" ? "admin" : "user";
}

async function resolveExpiredBan() {
  try {
    await dbConnect();
    await BanIssue.updateMany({ isResolved: false, endDate: { $lte: Date.now() } }, [
      { $set: { isResolved: true, resolvedAt: "$endDate" } },
    ]);
  } catch (error) {
    console.error(error);
  }
}

export const checkBan: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const [banIssue] = await Promise.all([
      BanIssue.countDocuments({ user: req.params.id, ...ActiveBanFilter }),
      resolveExpiredBan(),
    ]);
    res.status(200).json({ success: true, isBanned: !!banIssue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, isBanned: true });
  }
};

export const getActiveBanIssues: RequestHandler = async (req, res) => {
  try {
    const { data, total } = await getBanIssuesDB({
      ...ActiveBanFilter,
      ...(req.user!.role == "user"
        ? { user: mongoose.Types.ObjectId.createFromHexString(req.user!.id) }
        : {}),
    });
    res.status(200).json({ success: true, total, count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getUserBanIssues: RequestHandler = async (req, res) => {
  try {
    const { data, total } = await getBanIssuesDB({
      user: mongoose.Types.ObjectId.createFromHexString(req.user!.id),
    });
    res.status(200).json({ success: true, total, count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getBanIssue: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const result = (
      await BanIssue.aggregate<
        | {
            banIssue: Omit<Omit<BanIssueType, "user">, "admin"> & { user: UserType; admin: UserType };
            banAppeals: Omit<BanAppealType, "comment">[];
          }
        | undefined
      >([
        { $match: { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) } },
        { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
        { $lookup: { from: "users", localField: "admin", foreignField: "_id", as: "admin" } },
        { $lookup: { from: "banappeals", localField: "_id", foreignField: "banIssue", as: "banAppeals" } },
        { $set: { user: { $arrayElemAt: ["$user", 0] }, admin: { $arrayElemAt: ["$admin", 0] } } },
        {
          $set: {
            _id: { $toString: "$_id" },
            "user._id": { $toString: "$user._id" },
            "admin._id": { $toString: "$admin._id" },
          },
        },
        { $unwind: { path: "$banAppeals", preserveNullAndEmptyArrays: true } },
        {
          $set: {
            "banAppeals._id": { $toString: "$banAppeals._id" },
            "banAppeals.banIssue": { $toString: "$banAppeals.banIssue" },
          },
        },
        { $project: { "banAppeals.comment": 0 } },
        {
          $group: {
            _id: { $unsetField: { field: "banAppeals", input: "$$ROOT" } },
            banAppeals: { $push: "$banAppeals" },
          },
        },
        { $project: { _id: 0, banIssue: "$_id", banAppeals: "$banAppeals" } },
        {
          $set: {
            banAppeals: {
              $cond: [
                {
                  $eq: [{ $getField: { field: "_id", input: { $arrayElemAt: ["$banAppeals", 0] } } }, null],
                },
                [],
                "$banAppeals",
              ],
            },
          },
        },
      ])
    )[0];
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const createBanIssue: RequestHandler = async (req, res) => {
  try {
    await dbConnect();
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
    } else if (
      (await BanIssue.countDocuments({
        user: mongoose.Types.ObjectId.createFromHexString(req.user!.id),
        ...ActiveBanFilter,
      })) > 0
    ) {
      console.log(req.body);
      res.status(400).json({ success: false, message: "user is already banned" });
    } else {
      const banIssue = await BanIssue.insertOne({ ...req.body, user: user.id, admin: req.user!.id });
      if (banIssue) {
        res.status(201).json({ success: true, data: banIssue });
      } else {
        res.status(500).json({ success: false });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const resolveBanIssue: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const banIssue = await BanIssue.findByIdAndUpdate(
      req.params.id,
      { isResolved: true },
      { new: true, runValidators: true }
    );
    if (banIssue) {
      res.status(200).json({ success: true, data: banIssue });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

async function getBanIssuesDB(filter: mongoose.FilterQuery<BanIssueType>) {
  await dbConnect();
  const result = (
    await BanIssue.aggregate<
      | {
          data: (Omit<Omit<BanIssueType, "user">, "admin"> & { user: UserType; admin: UserType })[];
          total: number;
        }
      | undefined
    >([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          // pipeline: [{ $match: { $or: [{ name: { $regex: search } }, { email: { $regex: search } }] } }],
        },
      },
      { $lookup: { from: "users", localField: "admin", foreignField: "_id", as: "admin" } },
      { $match: { user: { $not: { $size: 0 } } } },
      { $set: { user: { $arrayElemAt: ["$user", 0] }, admin: { $arrayElemAt: ["$admin", 0] } } },
      {
        $set: {
          _id: { $toString: "$_id" },
          "user._id": { $toString: "$user._id" },
          "admin._id": { $toString: "$admin._id" },
        },
      },
      { $group: { _id: null, data: { $push: "$$ROOT" }, total: { $count: {} } } },
      { $project: { _id: 0, data: 1, total: 1 } },
      // { $project: { _id: 0, data: { $slice: ["$data", page * limit, limit] }, total: 1 } },
    ])
  )[0];
  return { data: result?.data || [], total: result?.total || 0 };
}
