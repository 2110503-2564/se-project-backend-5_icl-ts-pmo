import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import dbConnect from "./dbConnect.js";

export async function readToken(req: Request, res: Response, next: NextFunction) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token && token !== "null") {
    await dbConnect();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      req.user = await User.findById(decoded.id);
    } catch (err) {
      console.error(err);
    }
  }
  next();
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  if (req.user == null) {
    res.status(401).json({ success: false, message: "Not authorize to access this route" });
  } else {
    next();
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user!.role} is not authorized to access this route`,
      });
    } else {
      next();
    }
  };
};
