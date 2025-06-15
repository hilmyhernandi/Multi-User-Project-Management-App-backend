import { Request, Response, NextFunction } from "express";
import validationsInput from "../validations/membershipValidations";
import projectService from "../service/projectService";
import membersService from "../service/membersService";
import taskService from "../service/taskService";
import { errorResponse } from "../error/error";

export const createMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, projectId } = req.body;

    const { error } = validationsInput.schemaMembership.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new errorResponse("Project not found.", 404);
    }

    if (userId === project.ownerId) {
      throw new errorResponse("Project owner cannot be a member.", 409);
    }

    const isMemberExists = await membersService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    );
    if (isMemberExists) {
      throw new errorResponse("User is already a member of this project.", 409);
    }

    await membersService.createMembers(userId, projectId);

    res.status(201).json({ message: "Member added successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteMembership = async (
  req: Request<{ userId: string; projectId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, projectId } = req.params;

    const { error } = validationsInput.schemaMembership.validate(req.params);
    if (error) {
      return next(new errorResponse(error.details[0].message, 400));
    }

    const membership = await membersService.getMemberByUserIdAndProjectId(
      userId,
      projectId
    );

    if (!membership) {
      return next(new errorResponse("Membership not found.", 404));
    }

    const hasTask = await taskService.hasTaskByMembership(userId, projectId);

    if (hasTask) {
      return next(new errorResponse("Membership not delete.", 404));
    }

    await membersService.deleteMember(userId, projectId);

    res.status(200).json({ message: "Membership deleted successfully." });
  } catch (error) {
    next(error);
  }
};
