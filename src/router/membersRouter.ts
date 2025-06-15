import express from "express";
import {
  createMembership,
  deleteMembership,
} from "../controllers/membersController";
import { jwtMiddleware } from "../middleware/authMiddleware";
export const membersRouter = express.Router();

membersRouter.post("/", jwtMiddleware, createMembership);
membersRouter.delete("/:userId/:projectId", jwtMiddleware, deleteMembership);
