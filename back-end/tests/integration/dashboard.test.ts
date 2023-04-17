import app, { init } from '../../src/app';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createFavoriteTicker, createUser } from '../factories';
import { conflictError } from '../../src/errors';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /dashboard/favorites', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/dashboard/favorites');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no favorites', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and favorites data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const favoriteTicker = await createFavoriteTicker(user.id);

      const response = await server.get('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: favoriteTicker.id,
          ticker: favoriteTicker.ticker,
        },
      ]);
    });
  });
});

describe('POST /dashboard/favorites', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/dashboard/favorites');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body is not sent', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post('/dashboard/favorites').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server
        .post('/dashboard/favorites')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidBody);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 409 when given ticker is already in favorites', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const favoriteTicker = await createFavoriteTicker(user.id);
      const body = { ticker: favoriteTicker.ticker };

      const response = await server.post('/dashboard/favorites').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual(conflictError('The selected ticker is already registered!'));
    });

    it('should respond with status 201 and favorites data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { ticker: faker.name.firstName() };

      const response = await server.post('/dashboard/favorites').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        ticker: body.ticker,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});

describe('DELETE /dashboard/favorites/:ticker', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.delete('/dashboard/favorites/0');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.delete('/dashboard/favorites/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete('/dashboard/favorites/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when given id does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete('/dashboard/favorites/0').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when given id does not belong to user', async () => {
      const user = await createUser();
      const favoriteTicker = await createFavoriteTicker(user.id);

      const newUser = await createUser();
      const token = await generateValidToken(newUser);

      const response = await server
        .delete(`/dashboard/favorites/${favoriteTicker.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 204 when successfully deleted', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const favoriteTicker = await createFavoriteTicker(user.id);

      const response = await server
        .delete(`/dashboard/favorites/${favoriteTicker.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NO_CONTENT);
    });
  });
});
