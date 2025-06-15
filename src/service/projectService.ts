import { prisma } from "../../prisma/client";

const createProject = async (name: string, ownerId: string) => {
  return prisma.project.create({
    data: { name, ownerId },
  });
};

const getProjectByName = async (name: string) => {
  return prisma.project.findFirst({
    where: {
      name,
    },
  });
};

const getProjectById = async (id: string) => {
  return prisma.project.findFirst({
    where: {
      id,
    },
  });
};

const getProjectDetailById = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      name: true,
      owner: {
        select: {
          email: true,
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          assigneeId: true,
          assignee: { select: { email: true } },
        },
      },
      memberships: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!project) return null;

  return {
    name: project.name,
    owner: project.owner?.email || null,
    tasks: project.tasks.map((task) => ({
      taskId: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignee: task.assignee?.email || null,
      assigneeId: task.assigneeId,
    })),
    memberships: project.memberships.map(({ user }) => user.email),
  };
};

const getProjectsByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      projects: { include: { owner: true } },
      memberships: { include: { project: { include: { owner: true } } } },
    },
  });

  if (!user) return [];

  const allProjects = [
    ...user.projects,
    ...user.memberships.map((m) => m.project),
  ];

  const uniqueProjects = Array.from(
    new Map(allProjects.map((p) => [p.id, p])).values()
  );

  return uniqueProjects.map((project) => ({
    id: project.id,
    name: project.name,
    owner: {
      email: project.owner.email,
    },
  }));
};

const getAllProjectsByUserId = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      memberships: {
        some: { userId },
      },
    },
    select: {
      id: true,
      name: true,
      owner: {
        select: {
          email: true,
        },
      },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    owner: project.owner.email,
  }));
};

const deleteProjectById = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};

export default {
  createProject,
  getProjectByName,
  getProjectById,
  getProjectDetailById,
  getAllProjectsByUserId,
  deleteProjectById,
  getProjectsByEmail,
};
