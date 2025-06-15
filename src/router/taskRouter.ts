import express from "express";
import taskController from "../controllers/taskController";
import { jwtMiddleware } from "../middleware/authMiddleware";
export const taskRouter = express.Router();

taskRouter.post("/", jwtMiddleware, taskController.createTask);
taskRouter.patch("/status", jwtMiddleware, taskController.updateStatusTask);
taskRouter.delete("/:taskId/:email", jwtMiddleware, taskController.deleteTask);
