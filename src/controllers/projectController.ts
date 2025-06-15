import { Request, Response, NextFunction } from "express";
import validationsInput from "../validations/projectValidations";
import taskService from "../service/taskService";
import membersService from "../service/membersService";
import projectService from "../service/projectService";
import userService from "../service/userService";
import { errorResponse } from "../error/error";

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nameProject, email } = req.body;

    const { error } = validationsInput.schemaCreateProject.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const users = await userService.getUserByEmail(email);
    const ownerId = users!.id;
    const existingProject = await projectService.getProjectByName(nameProject);
    if (existingProject) {
      throw new errorResponse("Project already exists.", 409);
    }
    await projectService.createProject(nameProject, ownerId);

    res.status(201).json({ message: "Project created successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (
  req: Request<{ id: string; email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, email } = req.params;

    const { error } = validationsInput.schemaDeleteProject.validate(req.params);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const project = await projectService.getProjectById(id);
    if (!project) {
      throw new errorResponse("Project not found.", 404);
    }

    const users = await userService.getUserByEmail(email);
    if (!users) {
      throw new errorResponse("User not found.", 404);
    }

    if (users.id !== project.ownerId) {
      throw new errorResponse(
        "You do not have permission to delete this project",
        403
      );
    }

    const [hasTasks, hasMembers] = await Promise.all([
      taskService.hasTask(id),
      membersService.hasMemberships(id),
    ]);

    if (hasTasks || hasMembers) {
      const blockedBy = [
        hasTasks ? "tasks" : null,
        hasMembers ? "members" : null,
      ]
        .filter(Boolean)
        .join(" and ");

      throw new errorResponse(
        `Cannot delete project: ${blockedBy} still assigned.`,
        409
      );
    }

    await projectService.deleteProjectById(id);

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (err) {
    next(err);
  }
};

const getAllProjectsByMembership = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { error } = validationsInput.schemaAllProject.validate(req.params);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const projects = await projectService.getAllProjectsByUserId(userId);
    res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
};

const getProjectDetail = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = validationsInput.schemaDetailProject.validate(req.params);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }
    const project = await projectService.getProjectDetailById(id);
    res.status(200).json({ data: project });
  } catch (err) {
    next(err);
  }
};

const getAllProject = async (
  req: Request<unknown, unknown, unknown, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.query;
    const { error } = validationsInput.schemaAllProjectByEmail.validate(req.query);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }
    const data = await projectService.getProjectsByEmail(email);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

export default {
  createProject,
  deleteProject,
  getAllProjectsByMembership,
  getProjectDetail,
  getAllProject,
};
