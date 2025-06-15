import express from "express";
import projectController from "../controllers/projectController";
import { jwtMiddleware } from "../middleware/authMiddleware";
export const projectRouter = express.Router();

projectRouter.get("/all", jwtMiddleware, projectController.getAllProject);
projectRouter.post("/", jwtMiddleware, projectController.createProject);
projectRouter.delete(
  "/:id/:email",
  jwtMiddleware,
  projectController.deleteProject
);
projectRouter.get(
  "/membership/:userId",
  jwtMiddleware,
  projectController.getAllProjectsByMembership
);
projectRouter.get("/:id", jwtMiddleware, projectController.getProjectDetail);
