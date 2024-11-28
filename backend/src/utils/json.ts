import { Task } from "../models/task";
import * as fs from "fs";
import * as path from "path";

const tasksFilePath = path.join(__dirname, "../database/tasks.json");
console.log(tasksFilePath);

// Read tasks from the JSON file
function readTasksFromFile(): Task[] {
  try {
    const data = fs.readFileSync(tasksFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write tasks to the JSON file
function writeTasksToFile(tasks: Task[]): void {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf-8");
}

export { readTasksFromFile, writeTasksToFile };
