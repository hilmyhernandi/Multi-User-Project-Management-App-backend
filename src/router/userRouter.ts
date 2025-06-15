import express from "express";
import { getAllUsers } from "../controllers/userController";
export const userRouter = express.Router();
import { jwtMiddleware } from "../middleware/authMiddleware";
userRouter.get("/all", jwtMiddleware, getAllUsers);
