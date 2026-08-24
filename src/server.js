const app = require("./app");
const config = require("./config");
const prisma = require("./lib/prisma");

async function start() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.error("Check DATABASE_URL in .env and that PostgreSQL is running.");
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Auth API running at http://localhost:${config.port}`);
    console.log(`Register:  POST http://localhost:${config.port}/api/auth/register`);
    console.log(`Login:     POST http://localhost:${config.port}/api/auth/login`);
    console.log(`Refresh:   POST http://localhost:${config.port}/api/auth/refresh`);
    console.log(`Logout:    POST http://localhost:${config.port}/api/auth/logout`);
    console.log(`Profile:   GET  http://localhost:${config.port}/api/auth/me`);
    console.log(`Tasks:     GET  http://localhost:${config.port}/api/tasks  (Bearer accessToken)`);
    console.log(`Prisma Studio: npm run db:studio`);
  });
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
