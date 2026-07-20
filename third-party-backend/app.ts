import express from "express";
import cors from "cors";
import ageRoutes from "./src/routes/ageRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Third-party backend is running" });
});

app.use("/api/age", ageRoutes);

export default app;
