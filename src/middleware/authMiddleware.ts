import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/customRequest";
import { verifyToken } from "../security/jwt/jwt";
import { errorResponse } from "../error/error";

export const jwtMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const tokenFromCookie = req.cookies?.token;

    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      throw new errorResponse("Unauthorized: No token provided", 401);
    }

    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    throw new errorResponse("Forbidden: Invalid token", 403);
  }
};
