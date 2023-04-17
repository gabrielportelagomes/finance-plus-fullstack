import { CreateUserParams, UpdateUserParams } from '@/protocols';
import userService from '../services/user-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';

export async function postUser(req: Request, res: Response) {
  const { name, email, password } = req.body as CreateUserParams;

  try {
    const user = await userService.createUser({ name, email, password });

    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    return res.status(httpStatus.CONFLICT).send(error);
  }
}

export async function updateUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { name, email, pictureUrl = null } = req.body as UpdateUserParams;

  try {
    const user = await userService.updateUser(userId, name, email, pictureUrl);

    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).send(error);
  }
}
