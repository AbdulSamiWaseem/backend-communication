import express from "express";
import cors from "cors";
import adminRoutes from "./src/routes/adminRoutes";
import ageRoutes from "./src/routes/ageRoutes";
import authRoutes from "./src/routes/authRoutes";
import localAuthRoutes from "./src/routes/localAuthRoutes";
import pageRoutes from "./src/routes/pageRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend app is running" });
});

app.use("/api", ageRoutes);
app.use("/api", authRoutes);
app.use("/api", localAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pages", pageRoutes);

export default app;
