import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth E2E (Backend)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('create account should return body', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'test@example.com', password: '123456' })
      .expect(401);

    expect(res.body).toBeDefined();
  });

  it('log in with wrong credential should not return token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'test@example.com', password: '123456' })
      .expect(401);

    expect(res.body.access_token).toBeUndefined();
  });

  it('log in with correct credential should return token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'racha@gmail.com', password: '1234' })
      .expect(201);

    expect(res.body.access_token).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
