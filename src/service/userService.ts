import { prisma } from "../../prisma/client";

const register = async (email: string, password: string) => {
  return prisma.user.create({
    data: { email, password },
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany();
};

export default {
  register,
  getUserByEmail,
  getAllUsers,
};
