import { prisma } from "../../prisma/client";

const createTask = async (
  title: string,
  description: string,
  projectId: string,
  assigneeId: string
) => {
  return prisma.task.create({
    data: { title, description, projectId, assigneeId },
  });
};

const getTaskById = async (id: string) => {
  return prisma.task.findFirst({
    where: {
      id,
    },
  });
};

const getTaskByProjectId = async (projectId: string) => {
  return prisma.task.findFirst({
    where: {
      projectId,
    },
  });
};

const updateStatusById = async (id: string, status: string) => {
  return prisma.task.updateMany({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

const assigneeIsInTaskProject = async (
  id: string,
  projectId: string,
  assigneeId: string
) => {
  return prisma.task.findFirst({
    where: {
      id,
      projectId,
      assigneeId,
    },
  });
};

const hasTask = async (projectId: string) => {
  const count = await prisma.task.count({ where: { projectId } });
  return count > 0;
};

const hasTaskByMembership = async (membershipId: string, projectId: string) => {
  const count = await prisma.task.count({
    where: { projectId, assigneeId: membershipId },
  });
  return count > 0;
};

const deleteTask = async (id: string, assigneeId: string) => {
  return prisma.task.deleteMany({
    where: { id, assigneeId },
  });
};

export default {
  createTask,
  getTaskById,
  getTaskByProjectId,
  assigneeIsInTaskProject,
  updateStatusById,
  hasTask,
  hasTaskByMembership,
  deleteTask,
};
