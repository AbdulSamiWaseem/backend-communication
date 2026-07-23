import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ageRoutes from "./src/routes/ageRoutes";
import oauthRoutes from "./src/routes/oauthRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "Third-party backend is running" });
});

app.use("/api/age", ageRoutes);
app.use("/oauth", oauthRoutes);

export default app;
