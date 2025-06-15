import { Response } from "express";

export const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60,
  });
};

export const clearTokenCookie = (res: Response) => {
  res.clearCookie("token");
};
