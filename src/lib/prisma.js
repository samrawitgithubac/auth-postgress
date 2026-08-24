/**
 * Prisma Client — connection to PostgreSQL
 * Reads DATABASE_URL from .env automatically
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
