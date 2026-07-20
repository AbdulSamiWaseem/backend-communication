import express from "express";
import cors from "cors";
import ageRoutes from "./src/routes/ageRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend app is running" });
});

app.use("/api", ageRoutes);

export default app;
