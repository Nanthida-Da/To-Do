import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import taskRoutes from "./routes/tasks";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.json());

app.use(cors());

app.use("/tasks", taskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
