import path from "path";
import fs from "fs";
import express, { Express } from "express";
import { User } from "./src/models/User";
import { Logger } from "./src/utils/Logger";
import { Project } from "./src/models/project";

const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Logger configuration
const logger = Logger.getLogger();

// Global error handlers
process.on("uncaughtException", (err) => {
  logger.error({ message: "Uncaught Exception", error: err.stack || err });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled Rejection", error: reason });
  process.exit(1);
});

// Create user tables at startup
(async () => {
  const user = new User("", "", "", "");
  await user.setupUser();

  const project = new Project(1, "", "", "", "", "");
  await project.setupProject();
})();
