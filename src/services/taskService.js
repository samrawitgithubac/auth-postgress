/**
 * TASK SERVICE — logged-in users manage their own tasks in PostgreSQL
 */

const prisma = require("../lib/prisma");

function notFound() {
  const error = new Error("Task not found");
  error.statusCode = 404;
  return error;
}

function forbidden() {
  const error = new Error("You can only access your own tasks");
  error.statusCode = 403;
  return error;
}

async function listMine(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function getMine(userId, taskId) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw notFound();
  if (task.userId !== userId) throw forbidden();
  return task;
}

async function create(userId, { title, description }) {
  return prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      userId,
    },
  });
}

async function update(userId, taskId, data) {
  await getMine(userId, taskId);

  const patch = {};
  if (data.title !== undefined) patch.title = data.title.trim();
  if (data.description !== undefined) patch.description = data.description.trim() || null;
  if (data.completed !== undefined) patch.completed = data.completed;

  return prisma.task.update({
    where: { id: taskId },
    data: patch,
  });
}

async function remove(userId, taskId) {
  await getMine(userId, taskId);
  await prisma.task.delete({ where: { id: taskId } });
  return { message: "Task deleted" };
}

module.exports = { listMine, getMine, create, update, remove };
