import { invalidCredentialsError } from '../../errors';
import { SignInParams } from '../../protocols';
import sessionRepository from '../../repositories/session-repository';
import userRepository from '../../repositories/user-repository';
import { exclude } from '../../utils/prisma-utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function postSignIn(params: SignInParams) {
  const { email, password } = params;

  const user = await findUser(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function findUser(email: string) {
  const user = await userRepository.findByEmail(email, {
    id: true,
    name: true,
    email: true,
    password: true,
    pictureUrl: true,
  });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

const authService = {
  postSignIn,
};

export default authService;
