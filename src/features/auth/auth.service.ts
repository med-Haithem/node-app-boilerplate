import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUser } from "./definitions";
import { prisma, generateJWT } from "../../utils";
import httpStatus from "http-status";
import AppError from "@utils/app-error";
import logger from "@utils/logger";

const { ACCESS_TOKEN_EXPIRES_IN, JWT_ACCESS_TOKEN_SECRET } = config;

const doRegister = async ({
  Email,
  FirstName,
  LastName,
  Password,
  Role = "USER",
  BirthDate,
}: RegisterUser) => {
  const isUserFound = await doCheckUserExist(Email);

  if (isUserFound) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User already exist!");
  }
  try {
    const user = await prisma.user.create({
      data: {
        Email: Email,
        Password: bcrypt.hashSync(Password, 10),
        Role,
        FirstName,
        LastName,
        BirthDate: new Date(BirthDate),
      },
    });
    // generate access token
    const payload = {
      Email,
      userID: user.ID,
    };
    const token = await generateJWT({
      secretKey: JWT_ACCESS_TOKEN_SECRET,
      payload,
      signOption: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    });
    return {
      access_token: token,
      ...payload,
    };
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot Create User");
  }
};

const doLogin = async ({
  email,
  passedPassword,
  actualPassword,
  name,
  userID,
  role,
}: any) => {
  const isValidPass = bcrypt.compareSync(passedPassword, actualPassword);
  if (!isValidPass)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with the specified email does not exist"
    );

  // generate access token
  const payload = {
    email,
    name,
    userID,
    role,
  };

  const token = await generateJWT({
    secretKey: JWT_ACCESS_TOKEN_SECRET,
    payload,
    signOption: {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });

  return {
    access_token: token,
    ...payload,
  };
};

const doCheckUserExist = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      Email: email,
    },
  });
  return user || null;
};

export default { doCheckUserExist, doLogin, doRegister };
