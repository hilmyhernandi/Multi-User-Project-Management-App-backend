import { Request, Response, NextFunction } from "express";
import validationsInput from "../validations/authValidations";
import { errorResponse } from "../error/error";
import userService from "../service/userService";
import { generateToken } from "../security/jwt/jwt";
import { setTokenCookie } from "../utils/cookies";
import { generateHash, comparePassword } from "../security/hash";
import bruteforce from "../security/redis/bruteforce";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { error } = validationsInput.schemaRegister.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      throw new errorResponse("User already exists", 409);
    }

    const hashedPassword = await generateHash(password);
    await userService.register(email, hashedPassword);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { error } = validationsInput.schemaLogin.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const user = await userService.getUserByEmail(email);
    const attempts = await bruteforce.checkRateLimit(email);
    if (attempts >= 3) {
      throw new errorResponse(
        "too many login attempts, please try again after 15 minutes",
        429
      );
    }

    if (!user || !(await comparePassword(password, user.password))) {
      await bruteforce.trackFailedLogin(email);
      throw new errorResponse("Invalid email or password", 401);
    }
    await bruteforce.resetFailedLoginAttempts(email);
    const token = await generateToken({ id: user.id }, 36000);
    setTokenCookie(res, token);
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
};
