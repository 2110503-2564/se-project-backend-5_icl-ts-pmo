import express from "express";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
// @ts-ignore
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import authRouter from "./routes/auth.js";
import coworkingSpaceRouter from "./routes/coworkingSpaces.js";
import UserRouter from "./routes/user.js";
import reservationRouter from "./routes/reservations.js";
import banIssueRouter from "./routes/banIssue.js";
import banAppealRouter from "./routes/banAppeal.js";

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
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/reservations", reservationRouter);
app.use("/api/v1/banIssues", banIssueRouter);
app.use("/api/v1/banAppeals", banAppealRouter);

/** Swagger */
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Co-Working Space API",
      version: "1.0.0",
      description: "API for Co-Working Space Reservations",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api/v1"
            : "https://co-working-space-backend-kappa.vercel.app/api/v1",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${PORT} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  server.close(() => process.exit(1));
});

export default app;
