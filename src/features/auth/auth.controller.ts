import { User } from "@prisma/client";
import AppError from "@utils/app-error";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import authService from "./auth.service";
import { RegisterUser } from "./definitions";

const { doCheckUserExist, doLogin, doRegister } = authService;

const login = async (
  httpRequest: Request,
  res: Response,
  next: NextFunction
) => {
  const { Email, Password } = httpRequest.body;
  try {
    const userData = await doCheckUserExist(Email);
    const loginData = {
      email: Email,
      passedPassword: Password,
      actualPassword: userData?.Password,
      firstName: userData?.FirstName,
      lastName: userData?.LastName,
      userID: userData?.ID,
      role: userData?.Role,
    };

    const loginResult = await doLogin(loginData);
    res.status(httpStatus.OK).send({
      success: true,
      message: "Successfully logged in!",
      data: loginResult,
    });
  } catch (err) {
    next(err);
  }
};

const register = async (
  httpRequest: Request,
  res: Response,
  next: NextFunction
) => {
  const userCreationPayload: RegisterUser = httpRequest.body;
  try {
    const registerResult = await doRegister({
      ...userCreationPayload,
    });
    res.status(httpStatus.OK).send({
      success: true,
      message: "Registered successfully!",
      data: registerResult,
    });
  } catch (err) {
    next(err);
  }
};

const userInfo = async (
  httpRequest: any,
  res: Response,
  next: NextFunction
) => {
  const { email } = httpRequest.user;

  try {
    const user = await doCheckUserExist(email);
    if (!user) {
      throw new AppError(httpStatus.BAD_GATEWAY, "User doesn't exist!");
    }

    const { Email, FirstName, LastName } = user;

    res.status(httpStatus.OK).send({
      user: { Email, FirstName, LastName },
    });
  } catch (err) {
    next(err);
  }
};

export default { login, register, userInfo };
