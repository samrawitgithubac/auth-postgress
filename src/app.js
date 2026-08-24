const express = require("express");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", database: "postgresql", orm: "prisma" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
