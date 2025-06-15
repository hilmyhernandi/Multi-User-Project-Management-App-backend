import { Request, Response, NextFunction } from "express";
import userService from "../service/userService";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await userService.getAllUsers();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
