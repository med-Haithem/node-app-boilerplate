import validator from "@middlewares/validator";
import express from "express";
import { authGuard } from "../../middlewares";
import userController from "./auth.controller";
import { createUserValidation, UserLoginValidation } from "./definitions";

const authRouter = express.Router();

authRouter.post("/login", validator(UserLoginValidation), userController.login);
authRouter.post(
  "/register",
  validator(createUserValidation),
  userController.register
);
authRouter.get("/userInfo", authGuard, userController.userInfo);

export default authRouter;
