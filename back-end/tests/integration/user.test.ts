import app, { init } from '../../src/app';
import { conflictError, forbiddenError } from '../../src/errors';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import * as jwt from 'jsonwebtoken';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /user', () => {
  it('should respond with status 400 when body is not sent', async () => {
    const response = await server.post('/user');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/user').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    it('should respond with status 409 when there is an user with given email', async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post('/user').send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual(conflictError('There is already an user with given email!'));
    });

    it('should respond with status 201 and user data', async () => {
      const body = generateValidBody();

      const response = await server.post('/user').send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        email: body.email,
      });
    });
  });
});

describe('PATCH /user', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.patch('/user');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.patch('/user').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.patch('/user').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body is not sent', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.patch('/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.patch('/user').set('Authorization', `Bearer ${token}`).send(invalidBody);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 403 when the email does not belong to the user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const newUser = await createUser();
      const body = { name: faker.name.firstName(), email: newUser.email };

      const response = await server.patch('/user').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
      expect(response.body).toEqual(forbiddenError());
    });

    it('should respond with status 200 and user data when pictureUrl is not sent', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { name: faker.name.firstName(), email: user.email };

      const response = await server.patch('/user').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        user: {
          id: user.id,
          name: body.name,
          email: user.email,
          pictureUrl: null,
        },
      });
    });

    it('should respond with status 200 and user data when pictureUrl is sent', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { name: faker.name.firstName(), email: user.email, pictureUrl: faker.internet.url() };

      const response = await server.patch('/user').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        user: {
          id: user.id,
          name: body.name,
          email: user.email,
          pictureUrl: body.pictureUrl,
        },
      });
    });
  });
});
