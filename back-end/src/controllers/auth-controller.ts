import { SignInParams } from '../protocols';
import authService from '../services/auth-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function postSignIn(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authService.postSignIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
