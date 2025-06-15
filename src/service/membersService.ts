import { prisma } from "../../prisma/client";

const createMembers = async (userId: string, projectId: string) => {
  return prisma.membership.create({
    data: { userId, projectId },
  });
};

const getMemberByUserIdAndProjectId = async (
  userId: string,
  projectId: string
) => {
  return prisma.membership.findFirst({
    where: {
      userId,
      projectId,
    },
  });
};

const deleteMember = async (userId: string, projectId: string) => {
  return prisma.membership.deleteMany({
    where: {
      userId,
      projectId,
    },
  });
};

const hasMemberships = async (projectId: string) => {
  const count = await prisma.membership.count({ where: { projectId } });
  return count > 0;
};

export default {
  createMembers,
  getMemberByUserIdAndProjectId,
  deleteMember,
  hasMemberships,
};
