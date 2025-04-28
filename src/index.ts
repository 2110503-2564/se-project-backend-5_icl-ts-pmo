import express from "express";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
// @ts-ignore
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

import authRouter from "./routes/auth.js";
import coworkingSpaceRouter from "./routes/coworkingSpaces.js";
// import coWorkingSpaces from "@/routes/co-working-spaces.js";
// const reservations = require("../routes/reservations");
import userRouter from "./routes/users.js";

// const mongoose = require("mongoose");
// mongoose.set("strictQuery", true);
// const swaggerUI = require("swagger-ui-express");
// const swaggerJsDoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 80,
  })
);
app.use(hpp());
app.use(cors());

/************ Routing ************/
app.get("/", (_, res) => {
  res.send("Co-Working Space API is running!");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/coworkingSpaces", coworkingSpaceRouter);
// app.use("/api/v1/reservations", reservations);
app.use("/api/v1/users", userRouter);

const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${PORT} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  server.close(() => process.exit(1));
});

export default app;

// // Swagger Options
// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Co-Working Space API",
//       version: "1.0.0",
//       description: "API for Co-Working Space Reservations",
//     },
//     servers: [
//       {
//         url:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:3000/api/v1"
//             : "https://co-working-space-backend-kappa.vercel.app/api/v1",
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);

// // Swagger UI Middleware
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
