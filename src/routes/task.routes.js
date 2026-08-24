/**
 * TASK ROUTES — all require login (Bearer accessToken)
 * Each user only sees/edits their own tasks
 */

const express = require("express");
const taskController = require("../controllers/taskController");
const { requireAuth } = require("../middleware/auth");
const { validateCreateTask, validateUpdateTask } = require("../middleware/validateTask");

const router = express.Router();

router.use(requireAuth);

router.get("/", taskController.list);
router.get("/:id", taskController.getOne);
router.post("/", validateCreateTask, taskController.create);
router.put("/:id", validateUpdateTask, taskController.update);
router.delete("/:id", taskController.remove);

module.exports = router;
