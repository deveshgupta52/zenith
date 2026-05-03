import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";

import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


const app = express();

app.use(cors({
  origin: "https://zenith-production-999a.up.railway.app",
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.json({ message: "Zenith API is running", env: config.NODE_ENV }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);





export default app;

