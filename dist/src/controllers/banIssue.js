import dbConnect from "../dbConnect.js";
import BanIssue from "../models/BanIssue.js";
export const ActiveBanFilter = {
    endDate: { $gt: new Date() },
    isResolved: false,
};
export const checkBan = async (req, res) => {
    await dbConnect();
    try {
        const [banIssue] = await Promise.all([
            BanIssue.countDocuments({ user: req.params.id, ...ActiveBanFilter }),
            resolveExpiredBan(),
        ]);
        res.status(200).json({ success: true, isBanned: !!banIssue });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, isBanned: true });
    }
};
export async function resolveExpiredBan() {
    try {
        await dbConnect();
        await BanIssue.updateMany({ isResolved: false, endDate: { $lte: Date.now() } }, [
            { $set: { isResolved: true, resolvedAt: "$endDate" } },
        ]);
    }
    catch (error) {
        console.error(error);
    }
}
