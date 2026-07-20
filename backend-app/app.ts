import express from "express";
import cors from "cors";
import ageRoutes from "./src/routes/ageRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Backend app is running",
    defaultMode: process.env.DEFAULT_COMMUNICATION_MODE || "callback",
  });
});

app.use("/api/age", ageRoutes);

export default app;
