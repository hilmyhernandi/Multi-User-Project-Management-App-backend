import { Request, Response, NextFunction } from "express";
import taskService from "../service/taskService";
import projectService from "../service/projectService";
import membershipService from "../service/membersService";
import validationsInput from "../validations/taskValidations";
import { errorResponse } from "../error/error";
import userService from "../service/userService";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, projectId, assigneeId } = req.body;

    const { error } = validationsInput.schemaCreateTask.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const project = await projectService.getProjectById(projectId);
    if (!project) throw new errorResponse("Project not found.", 404);

    const membership = await membershipService.getMemberByUserIdAndProjectId(
      assigneeId,
      projectId
    );
    if (!membership) throw new errorResponse("Membership not found.", 404);
    await taskService.createTask(title, description, projectId, assigneeId);

    res.status(201).json({ message: "Task created successfully." });
  } catch (error) {
    next(error);
  }
};

const updateStatusTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, status, projectId, assigneeId } = req.body;
    const { error } = validationsInput.schemaUpdateTask.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const isAssigneeValid = await taskService.assigneeIsInTaskProject(
      id,
      projectId,
      assigneeId
    );
    if (!isAssigneeValid)
      throw new errorResponse("You do not have access to this task.", 403);

    const membership = await membershipService.getMemberByUserIdAndProjectId(
      assigneeId,
      projectId
    );
    if (!membership) throw new errorResponse("Membership not found.", 404);

    const STATUS_ORDER = ["todo", "in-progress", "done"];
    const currentIndex = STATUS_ORDER.indexOf(isAssigneeValid.status);
    const newIndex = STATUS_ORDER.indexOf(status);

    if (newIndex < currentIndex) {
      throw new errorResponse(
        `Cannot change status from '${isAssigneeValid.status}' to '${status}'.`,
        400
      );
    }

    await taskService.updateStatusById(id, status);

    res.status(200).json({ message: "Task status updated successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, email } = req.params;
    const users = await userService.getUserByEmail(email);
    const assigneeId = users!.id;
    const isAssigneeValid = await taskService.getTaskById(taskId);
    if (isAssigneeValid!.assigneeId !== assigneeId) {
      throw new errorResponse(
        "You do not have permission to delete this task",
        403
      );
    }
    await taskService.deleteTask(taskId, assigneeId);
    res.status(200).json({ message: "Task delete successfully." });
  } catch (error) {
    next(error);
  }
};

export default {
  createTask,
  updateStatusTask,
  deleteTask,
};
