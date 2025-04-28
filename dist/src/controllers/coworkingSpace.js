import dbConnect from "../dbConnect.js";
import CoworkingSpace from "../models/CoworkingSpace.js";
import Reservation from "../models/Reservation.js";
import mongoose from "mongoose";
export const getCoWorkingSpaces = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const getCoWorkingSpace = async (req, res) => {
    await dbConnect();
    try {
        const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
        if (coWorkingSpace) {
            res.status(200).json({ success: true, data: coWorkingSpace });
        }
        else {
            res.status(400).json({ success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const createCoWorkingSpace = async (req, res) => {
    await dbConnect();
    try {
        const coworkingSpace = await CoworkingSpace.insertOne({ ...req.body, owner: req.user.id });
        if (coworkingSpace) {
            res.status(201).json({ success: true, data: coworkingSpace });
            return;
        }
    }
    catch (error) {
        console.error(error);
    }
    res.status(500).json({ success: false });
};
export const updateCoWorkingSpace = async (req, res) => {
    await dbConnect();
    try {
        const coWorkingSpace = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true,
        });
        if (coWorkingSpace) {
            res.status(200).json({ success: true, data: coWorkingSpace });
        }
        else {
            res.status(404).json({ successs: false });
        }
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
};
export const deleteCoWorkingSpace = async (req, res) => {
    await dbConnect();
    try {
        const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
        if (coWorkingSpace) {
            await Promise.all([
                CoworkingSpace.deleteOne({ _id: req.params.id }),
                Reservation.deleteMany({ coWorkingSpace: req.params.id }),
            ]);
            res.status(200).json({ success: true });
        }
        else {
            res.status(404).json({ success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const getCoworkingSpaceTotalReservation = async (req, res) => {
    await dbConnect();
    try {
        const result = (await Reservation.aggregate([
            {
                $facet: {
                    data: [
                        { $match: { coworkingSpace: mongoose.Types.ObjectId.createFromHexString(req.params.id) } },
                        { $group: { _id: "$approvalStatus", count: { $count: {} } } },
                        {
                            $group: {
                                _id: null,
                                items: { $push: { k: "$_id", v: "$count" } },
                                total: { $sum: "$count" },
                            },
                        },
                        {
                            $replaceRoot: {
                                newRoot: { $mergeObjects: [{ $arrayToObject: "$items" }, { total: "$total" }] },
                            },
                        },
                    ],
                },
            },
            { $replaceRoot: { newRoot: { $ifNull: [{ $arrayElemAt: ["$data", 0] }, { total: 0 }] } } },
            {
                $set: {
                    approved: { $ifNull: ["$approved", 0] },
                    pending: { $ifNull: ["$pending", 0] },
                    canceled: { $ifNull: ["$canceled", 0] },
                    rejected: { $ifNull: ["$rejected", 0] },
                },
            },
        ]))[0];
        if (result) {
            res.status(200).json({ success: true, data: result });
        }
        else {
            res.status(500).json({ success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const getCoworkingSpaceFrequency = async (req, res) => {
    await dbConnect();
    try {
        const result = (await Reservation.aggregate([
            { $match: { coworkingSpace: mongoose.Types.ObjectId.createFromHexString(req.params.id) } },
            {
                $set: {
                    startDate: {
                        $dateFromParts: {
                            year: { $year: "$startDate" },
                            month: { $month: "$startDate" },
                            day: { $dayOfMonth: "$startDate" },
                            hour: { $hour: "$startDate" },
                            minute: {
                                $subtract: [{ $minute: "$startDate" }, { $mod: [{ $minute: "$startDate" }, 30] }],
                            },
                        },
                    },
                    endDate: {
                        $dateFromParts: {
                            year: { $year: "$endDate" },
                            month: { $month: "$endDate" },
                            day: { $dayOfMonth: "$endDate" },
                            hour: { $hour: "$endDate" },
                            minute: { $subtract: [{ $minute: "$endDate" }, { $mod: [{ $minute: "$endDate" }, 30] }] },
                        },
                    },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        data: {
                            $cond: [
                                { $expr: { $eq: ["$startDate", "$endDate"] } },
                                [{ _id: "$_id", time: "$startDate" }],
                                [
                                    { _id: "$_id", time: "$startDate" },
                                    { _id: "$_id", time: "$endDate" },
                                ],
                            ],
                        },
                    },
                },
            },
            { $unwind: { path: "$data" } },
            {
                $densify: {
                    field: "data.time",
                    partitionByFields: ["data._id"],
                    range: { step: 30, unit: "minute", bounds: "partition" },
                },
            },
            {
                $lookup: { from: "reservations", localField: "data._id", foreignField: "_id", as: "reservation" },
            },
            { $unwind: { path: "$reservation" } },
            {
                $group: {
                    _id: {
                        $dateFromParts: { year: 1, hour: { $hour: "$data.time" }, minute: { $minute: "$data.time" } },
                    },
                    approved: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "approved"] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "rejected"] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "pending"] }, 1, 0] } },
                    canceled: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "canceled"] }, 1, 0] } },
                },
            },
            {
                $densify: {
                    field: "_id",
                    range: {
                        step: 30,
                        unit: "minute",
                        bounds: [new Date("0001-01-01T00:00:00.000Z"), new Date("0001-01-02T00:00:00.000Z")],
                    },
                },
            },
            {
                $fill: {
                    sortBy: { _id: 1 },
                    output: {
                        approved: { value: 0 },
                        rejected: { value: 0 },
                        canceled: { value: 0 },
                        pending: { value: 0 },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    label: { $push: { $dateToString: { date: "$_id", format: "%H:%M" } } },
                    approved: { $push: "$approved" },
                    pending: { $push: "$pending" },
                    canceled: { $push: "$canceled" },
                    rejected: { $push: "$rejected" },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        data: [
                            { label: "Approved", data: "$approved" },
                            { label: "Rejected", data: "$rejected" },
                            { label: "Pending", data: "$pending" },
                            { label: "Canceled", data: "$canceled" },
                        ],
                        label: "$label",
                    },
                },
            },
        ]))[0];
        if (result) {
            res.status(200).json({ success: true, data: result });
        }
        else {
            res.status(500).json({ success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
