import express from "express";
import cors from "cors";
import ageRoutes from "./src/routes/ageRoutes";
import authRoutes from "./src/routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend app is running" });
});

app.use("/api", ageRoutes);
app.use("/api", authRoutes);

export default app;
