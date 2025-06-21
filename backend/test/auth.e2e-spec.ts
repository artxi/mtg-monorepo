import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
        displayName: 'Test User',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should login with correct credentials', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should not login with wrong password', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });
    expect(res.status).toBe(401);
  });
});
