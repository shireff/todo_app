import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

 
  it('/api/users (GET) - should return list of users', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/api/users/:id (GET) - should return a specific user', () => {
    const userId = '1';
    return request(app.getHttpServer())
      .get(`/api/users/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(userId);
      });
  });

  it('/api/users (POST) - should create a new user', () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
    };

    return request(app.getHttpServer())
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(newUser.name);
        expect(res.body.email).toBe(newUser.email);
      });
  });

  it('/api/users/:id (PUT) - should update a user', () => {
    const userId = '1';
    const updatedUser = {
      name: 'Updated User',
      email: 'updated@example.com',
    };

    return request(app.getHttpServer())
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(userId);
        expect(res.body.name).toBe(updatedUser.name);
        expect(res.body.email).toBe(updatedUser.email);
      });
  });

  it('/api/users/:id (DELETE) - should delete a user', () => {
    const userId = '1';
    return request(app.getHttpServer())
      .delete(`/api/users/${userId}`)
      .expect(200);
  });

  it('/non-existent-route (GET) - should return 404', () => {
    return request(app.getHttpServer()).get('/non-existent-route').expect(404);
  });

  it('/api/auth (POST) - should authenticate user', () => {
    const credentials = {
      username: 'testuser',
      password: 'password123',
    };

    return request(app.getHttpServer())
      .post('/api/auth')
      .send(credentials)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
      });
  });
});
