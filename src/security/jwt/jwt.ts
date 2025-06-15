import jwt from "jsonwebtoken";
import { environments } from "../../config/environment";

const { jwtSecret } = environments;

export const generateToken = async (
  payload: Record<string, string>,
  times: number
) => {
  const token = jwt.sign(payload, jwtSecret!, {
    expiresIn: times,
  });
  return token;
};

export const verifyToken = async (token: string) => {
  const verifToken = jwt.verify(token, jwtSecret!);
  return verifToken;
};
