import User from "../models/User.js";
import dbConnect from "../dbConnect.js";
export const getUser = async (req, res) => {
    await dbConnect();
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.status(200).json({ success: true, data: user });
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
