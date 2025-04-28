import dbConnect from "../dbConnect.js";
import BanAppeal from "../models/BanAppeal.js";
import BanIssue from "../models/BanIssue.js";
import mongoose from "mongoose";
export const getBanAppeals = async (req, res) => {
    try {
        await dbConnect();
        const result = (await BanAppeal.aggregate([
            { $project: { comment: 0 } },
            { $lookup: { from: "banissues", localField: "banIssue", foreignField: "_id", as: "banIssue" } },
            { $set: { banIssue: { $arrayElemAt: ["$banIssue", 0] } } },
            { $lookup: { from: "users", localField: "banIssue.user", foreignField: "_id", as: "banIssue.user" } },
            { $set: { "banIssue.user": { $arrayElemAt: ["$banIssue.user", 0] } } },
            {
                $set: {
                    _id: { $toString: "$_id" },
                    "banIssue._id": { $toString: "$banIssue._id" },
                    "banIssue.user._id": { $toString: "$banIssue.user._id" },
                    "banIssue.admin": { $toString: "$banIssue.admin" },
                },
            },
            { $group: { _id: null, data: { $push: "$$ROOT" }, total: { $count: {} } } },
            { $project: { _id: 0, data: 1, total: 1 } },
            // { $project: { _id: 0, data: { $slice: ["$data", page * limit, limit] }, total: 1 } },
        ]))[0];
        res.status(200).json({
            success: true,
            data: result?.data || [],
            count: result?.data.length || 0,
            total: result?.total || 0,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const getBanAppeal = async (req, res) => {
    try {
        await dbConnect();
        const banAppeal = (await BanAppeal.aggregate([
            { $match: { _id: mongoose.Types.ObjectId.createFromHexString(req.params.appeal) } },
            { $lookup: { from: "banissues", localField: "banIssue", foreignField: "_id", as: "banIssue" } },
            { $set: { banIssue: { $arrayElemAt: ["$banIssue", 0] } } },
            {
                $set: {
                    _id: { $toString: "$_id" },
                    "banIssue._id": { $toString: "$banIssue._id" },
                    "banIssue.user": { $toString: "$banIssue.user" },
                    "banIssue.admin": { $toString: "$banIssue.admin" },
                },
            },
            { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "users", localField: "comment.user", foreignField: "_id", as: "comment.user" } },
            { $set: { "comment.user": { $arrayElemAt: ["$comment.user", 0] } } },
            {
                $set: {
                    "comment._id": { $toString: "$comment._id" },
                    "comment.user._id": { $toString: "$comment.user._id" },
                },
            },
            {
                $group: {
                    _id: { $unsetField: { field: "comment", input: "$$ROOT" } },
                    comment: { $push: "$comment" },
                },
            },
            { $replaceRoot: { newRoot: { $mergeObjects: ["$_id", { comment: "$comment" }] } } },
            {
                $set: {
                    comment: {
                        $cond: [
                            { $eq: [{ $getField: { field: "_id", input: { $arrayElemAt: ["$comment", 0] } } }, null] },
                            [],
                            "$comment",
                        ],
                    },
                },
            },
            { $project: { _id: 0 } },
        ]))[0];
        if (!banAppeal) {
            res.status(404).json({ success: false });
        }
        else if (banAppeal.banIssue.user.toHexString() != req.user.id && req.user.role != "admin") {
            res.status(403).json({ success: false });
        }
        else {
            res.status(200).json({ success: true, data: banAppeal });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const createBanAppeal = async (req, res) => {
    try {
        await dbConnect();
        const banIssue = await BanIssue.findById(req.params.id);
        if (!banIssue) {
            res.status(404).json({ success: false, message: "ban issue not found" });
        }
        else if (req.user.id != banIssue.user.toHexString()) {
            res.status(403).json({ success: false, message: "You are not this ban issue target" });
        }
        else {
            const banAppeal = await BanAppeal.insertOne(req.body);
            if (banAppeal) {
                res.status(201).json({ success: true, data: banAppeal });
            }
            else {
                res.status(500).json({ success: false });
            }
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
export const createBanAppealComment = async (req, res) => {
    try {
        await dbConnect();
        const banAppeal = await BanAppeal.findByIdAndUpdate(req.params.appeal, { $push: { comment: { ...req.body, user: req.user.id } } }, { new: true, runValidators: true });
        if (banAppeal) {
            res.status(201).json({ success: true });
        }
        else {
            res.status(500).json({ success: false });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
export const updateBanAppeal = async (req, res) => {
    await dbConnect();
    try {
        const resolveStatus = req.body.resolveStatus;
        const banAppeal = await BanAppeal.findById(req.params.appeal);
        if (banAppeal && banAppeal.resolveStatus == "pending") {
            const resolvedAt = new Date();
            const [updatedBanAppeal, updatedBanIssue] = await Promise.all([
                BanAppeal.findByIdAndUpdate(req.params.appeal, { resolveStatus, resolvedAt }, { new: true, runValidators: true }),
                resolveStatus == "resolved"
                    ? BanIssue.findByIdAndUpdate(req.params.id, { isResolved: true, resolvedAt }, { new: true, runValidators: true })
                    : null,
            ]);
            if (updatedBanAppeal) {
                res.status(200).json({ success: true, data: updatedBanAppeal });
            }
            else {
                res.status(500).json({ success: false });
            }
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
