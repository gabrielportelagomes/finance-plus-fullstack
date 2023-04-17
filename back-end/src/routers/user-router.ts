import { postUser, updateUser } from '../controllers';
import { authenticateToken, validateBody } from '../middlewares';
import { createUserSchema, updateUserSchema } from '../schemas';
import { Router } from 'express';

const userRouter = Router();

userRouter.post('/', validateBody(createUserSchema), postUser);
userRouter.patch('/', authenticateToken, validateBody(updateUserSchema), updateUser);

export { userRouter };
