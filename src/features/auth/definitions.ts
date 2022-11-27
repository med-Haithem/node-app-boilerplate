import Joi from "joi";

import { Role } from "@prisma/client";
import { ValidationSchema } from "@utils/validation-schema";

export interface RegisterUser {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Role: Role;
  BirthDate: string;
}

export const createUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    Email: Joi.string().email(),
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    BirthDate: Joi.string().required(),
    Password: Joi.string().required(),
  }),
};

export const UserLoginValidation: ValidationSchema = {
  body: Joi.object().keys({
    Email: Joi.string().email(),
    Password: Joi.string().required(),
  }),
};
