// Routes
import authModule from "../features/auth/auth.module";
import { Express } from "express";

const { authRoute } = authModule;
export const getRoutes = (app: Express) => {
  app.use("/api/auth", authRoute);
};
