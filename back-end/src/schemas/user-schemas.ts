import { CreateUserParams, UpdateUserParams } from '../protocols';
import Joi from 'joi';

export const createUserSchema = Joi.object<CreateUserParams>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object<UpdateUserParams>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  pictureUrl: Joi.string().uri(),
});
