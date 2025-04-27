import User from "../models/User.js";
import dbConnect from "../dbConnect.js";
function sendTokenResponse(user, statusCode, res) {
    const token = user.getSignedJwtToken();
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
    };
    res.cookie("token", token, cookieOptions).status(statusCode).json({ success: true, token });
}
export const register = async (req, res) => {
    await dbConnect();
    try {
        const { name, email, phone, password } = req.body;
        const user = await User.create({ name, email, phone, password });
        sendTokenResponse(user, 201, res);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};
export const login = async (req, res) => {
    await dbConnect();
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.findOne({ email }).select("+password");
            if (user && (await user.matchPassword(password))) {
                sendTokenResponse(user, 200, res);
            }
            else {
                res.status(400).json({ success: false, msg: "Invalid credentials" });
            }
        }
        else {
            res.status(400).json({ success: false, msg: `Please provide an email and password` });
        }
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ success: false, msg: "Cannot convert email or password to string" });
    }
};
export const getMe = async (req, res) => {
    await dbConnect();
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.status(200).json({ success: true, data: user });
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
export const logout = async (req, res) => {
    res
        .status(200)
        .cookie("token", "null", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true })
        .json({ success: true, data: {} });
};
