import { Role, User } from "@prisma/client";
import { Response, NextFunction } from "express";
import config from "../config";
import authService from "../features/auth/auth.service";
import httpStatus from "http-status";

import { verifyJWT } from "../utils";
import AppError from "@utils/app-error";
const { ACCESS_TOKEN_EXPIRES_IN, JWT_ACCESS_TOKEN_SECRET } = config;

export const adminGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization") || req.header("authorization");
  if (!token) {
    next(new AppError(httpStatus.UNAUTHORIZED, "Unathorized"));
  }

  token = token.replace("Bearer ", "");

  try {
    const payload: any = await verifyJWT({
      token,
      secretKey: JWT_ACCESS_TOKEN_SECRET,
      signOption: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    });
    req.user = payload;
    if ((payload.role as Role) !== Role.ADMIN) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unathorized");
    }
    req = { ...req, user: payload };
    return next();
  } catch (err) {
    next(new AppError(httpStatus.UNAUTHORIZED, "Session Timeout"));
  }
};
