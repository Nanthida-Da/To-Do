import { Router, Request, Response } from "express";
import { Task } from "../models/task";
import { validationResult } from "express-validator/lib/validation-result";
import { body } from "express-validator/lib/middlewares/validation-chain-builders";
import { readTasksFromFile, writeTasksToFile } from "../utils/json";
import sleep from "../utils/sleep";

const router = Router();
let tasks: Task[] = readTasksFromFile();

// Validation rules
const taskValidationRules = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("completed").isBoolean().withMessage("Completed must be a boolean"),
];

// Create
router.post("/", taskValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid request", error: errors.array() });
    return;
  }

  const task: Task = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false,
  };

  tasks.push(task);

  writeTasksToFile(tasks);

  await sleep(3000);

  res.status(201).json({ message: "Task created successfully", task });
});

// Read all
router.get("/", async (req: Request, res: Response) => {
  await sleep(3000);

  res.json(tasks);
});

// Read by ID
router.get("/:id", async (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));

  if (!task) {
    res.status(404).send("Task not found");
  } else {
    await sleep(3000);

    res.json(task);
  }
});

// Update
router.put("/:id", taskValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Task not found", error: errors.array() });
  }

  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    res.status(404).json({ message: "Task not found" });
  } else {
    tasks[taskIndex].title = req.body.title;
    tasks[taskIndex].completed = req.body.completed;

    writeTasksToFile(tasks);

    await sleep(3000);

    res.json({ message: "Task updated successfully", task: tasks[taskIndex] });
  }
});

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send("Task not found");
  } else {
    tasks.splice(index, 1);

    writeTasksToFile(tasks);

    await sleep(3000);

    res.status(204).send();
  }
});

export default router;
