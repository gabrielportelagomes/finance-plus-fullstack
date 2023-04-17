import { exclude } from '@/utils/prisma-utils';
import { conflictError, forbiddenError } from '../../errors';
import { CreateUserParams, UpdateUserParams } from '../../protocols';
import userRepository from '../../repositories/user-repository';
import bcrypt from 'bcrypt';

export async function createUser({ name, email, password }: CreateUserParams) {
  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);

  return userRepository.create({
    name,
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);

  if (userWithSameEmail) {
    throw conflictError('There is already an user with given email!');
  }
}

export async function updateUser(userId: number, name: string, email: string, pictureUrl: string) {
  const user = await userRepository.findById(userId);

  if (user.email !== email) {
    throw forbiddenError();
  }

  const update = await userRepository.update(userId, name, pictureUrl);

  return { user: exclude(update, 'password', 'createdAt', 'updatedAt') };
}

const userService = {
  createUser,
  updateUser,
};

export default userService;
