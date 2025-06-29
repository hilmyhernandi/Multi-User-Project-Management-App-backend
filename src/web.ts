import express, { Application } from "express";
import { errorHandlers } from "./middleware/errorHandlers";
import { authRouter } from "./router/authRouter";
import { projectRouter } from "./router/projectRouter";
import { membersRouter } from "./router/membersRouter";
import { taskRouter } from "./router/taskRouter";
import { userRouter } from "./router/userRouter";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimiter } from "../src/security/redis/ratelimit";
import { corsOptions } from "./config/cors";
export const web: Application = express();
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cookieParser());
web.use(cors(corsOptions));
web.use(rateLimiter);
web.use("/api/auth", authRouter);
web.use("/api/user", userRouter);
web.use("/api/project", projectRouter);
web.use("/api/membership", membersRouter);
web.use("/api/task", taskRouter);

web.use(errorHandlers);
