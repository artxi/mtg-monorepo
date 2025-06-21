import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

jest.setTimeout(20000);

describe('Collection Endpoints (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;
  let cardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    server = app.getHttpServer();

    // Register and login to get token
    await request(server)
      .post('/auth/register')
      .send({
        email: 'collectionuser@example.com',
        password: 'testpassword',
        displayName: 'Collection User',
      });
    const loginRes = await request(server)
      .post('/auth/login')
      .send({
        email: 'collectionuser@example.com',
        password: 'testpassword',
      });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a collection card', async () => {
    const res = await request(server)
      .post('/collection')
      .set('Authorization', `Bearer ${token}`)
      .send({
        scryfallId: 'test-scryfall-id',
        quantity: 2,
      });
    expect(res.status).toBe(201);
    expect(res.body.scryfallId).toBe('test-scryfall-id');
    cardId = res.body._id;
  });

  it('should get all collection cards for the user', async () => {
    const res = await request(server)
      .get('/collection')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a collection card', async () => {
    const res = await request(server)
      .put(`/collection/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  it('should delete a collection card', async () => {
    const res = await request(server)
      .delete(`/collection/${cardId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
