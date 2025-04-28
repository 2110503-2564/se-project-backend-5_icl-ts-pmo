import User, { UserType } from "../models/User.js";
import { CookieOptions, RequestHandler, Response } from "express";
import dbConnect from "../dbConnect.js";

function sendResponse(user: UserType, statusCode: number, res: Response) {
  const token = user.getSignedJwtToken();
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
  };
  res
    .cookie("token", token, cookieOptions)
    .status(statusCode)
    .json({
      success: true,
      token,
      data: { _id: user._id.toHexString(), name: user.name, email: user.email, role: user.role },
    });
}

export const register: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.insertOne({ name, email, phone, password });
    sendResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, data: null });
  }
};

export const login: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email }).select("+password");
      if (user && (await user.matchPassword(password))) {
        sendResponse(user, 200, res);
      } else {
        res.status(400).json({ success: false, msg: "Invalid credentials", data: null });
      }
    } else {
      res.status(400).json({ success: false, msg: `Please provide an email and password`, data: null });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, msg: "Cannot convert email or password to string", data: null });
  }
};

export const me: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const user = await User.findById(req.user!.id);
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const logout: RequestHandler = async (req, res) => {
  res
    .status(200)
    .cookie("token", "null", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true })
    .json({ success: true, data: {} });
};
