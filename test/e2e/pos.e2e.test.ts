import app from '../../src';
import request from 'supertest';
import { token } from '../setup';
import { Pos } from '../../src/features/pos/@types/pos.t';
import { makePos } from '../factories/make-pos';

describe('E2E - Pos', () => {
  it('should be able to create a pos and fetch it', async () => {
    const pos = makePos();

    const res = await request(app).post('/api/pos').set('authorization', `Bearer ${token}`).send(pos);
    expect(res.status).toBe(201);

    const posId = res.body.id;
    const getRes = await request(app).get(`/api/pos/${posId}`).set('authorization', `Bearer ${token}`);
    const posBody = getRes.body as Pos;

    console.error(getRes.body);
    expect(posBody.status).toBe('pending');
    expect(posBody.province.name).toBe('Luanda');
  });

  it.skip('should be able to update a pos and fetch it', async () => {
    const pos = makePos();
    const res = await request(app).post('/api/pos').set('authorization', `Bearer ${token}`).send(pos);
    expect(res.status).toBe(201);

    const posId = res.body.id;
    const updatedPos = makePos({});

    const updatedRes = await request(app)
      .put(`/api/pos/${posId}`)
      .set('authorization', `Bearer ${token}`)
      .send(updatedPos);
    expect(updatedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/pos/${posId}`).set('authorization', `Bearer ${token}`);
    const posBody = getRes.body as Pos;

    expect(getRes.status).toBe(200);
    expect(posBody.id).toBe(posId);
  });

  it.skip('should be able to delete a pos and not fetch it', async () => {
    const pos = makePos();
    const res = await request(app).post('/api/pos').set('authorization', `Bearer ${token}`).send(pos);
    expect(res.status).toBe(201);

    const posId = res.body.id;

    const deletedRes = await request(app).delete(`/api/pos/${posId}`).set('authorization', `Bearer ${token}`);

    expect(deletedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/pos/${posId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body.message).toBe('Pos não encontrado');
  });

  it.skip('should be able to fetch all pos', async () => {
    const pos01 = makePos();
    const pos02 = makePos();

    const res01 = await request(app).post('/api/pos').set('authorization', `Bearer ${token}`).send(pos01);
    expect(res01.status).toBe(201);

    const res02 = await request(app).post('/api/pos').set('authorization', `Bearer ${token}`).send(pos02);
    expect(res02.status).toBe(201);

    const fetchRes = await request(app).get('/api/pos/').set('authorization', `Bearer ${token}`);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body).toHaveLength(2);
  });
});
