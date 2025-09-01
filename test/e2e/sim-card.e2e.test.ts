import request from 'supertest';
import { makeSimCard } from '../factories/make-sim-card';
import app from '../../src';
import { token } from '../setup';

describe('E2E - Group', () => {
  it('should be able to create a simCard and fetch it', async () => {
    const simCard = makeSimCard();

    const res = await request(app).post('/api/sim-cards').set('authorization', `Bearer ${token}`).send(simCard);
    expect(res.status).toBe(201);

    const simCardId = res.body.id;
    const getRes = await request(app).get(`/api/sim-cards/${simCardId}`).set('authorization', `Bearer ${token}`);

    console.log('SIM-CARDS: ', JSON.stringify(getRes.body, null, 2));
    expect(getRes.status).toBe(200);
  });

  it('should be able to update a simCard and fetch it', async () => {
    const simCard = makeSimCard();
    const res = await request(app).post('/api/sim-cards').set('authorization', `Bearer ${token}`).send(simCard);

    expect(res.status).toBe(201);

    const simCardId = res.body.id;

    const updatedSimCard = makeSimCard({
      number: 952366605,
      pin: 9999,
      puk: 9898989,
    });

    const updatedRes = await request(app)
      .put(`/api/sim-cards/${simCardId}`)
      .set('authorization', `Bearer ${token}`)
      .send(updatedSimCard);

    expect(updatedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/sim-cards/${simCardId}`).set('authorization', `Bearer ${token}`);

    console.log('SIM-CARDS: ', JSON.stringify(getRes.body, null, 2));

    expect(getRes.status).toBe(200);
    expect(getRes.body.pin).toBe(9999);
    expect(getRes.body.puk).toBe(9898989);
    expect(getRes.body.number).toBe(952366605);
  });

  it('should be able to delete a simCard and not fetch it', async () => {
    const simCard = makeSimCard();
    const res = await request(app).post('/api/sim-cards').set('authorization', `Bearer ${token}`).send(simCard);
    expect(res.status).toBe(201);

    const simCardId = res.body.id;
    const deletedRes = await request(app).delete(`/api/sim-cards/${simCardId}`).set('authorization', `Bearer ${token}`);
    expect(deletedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/sim-cards/${simCardId}`).set('authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });

  it('should be able to fetch all simCards', async () => {
    const simCard01 = makeSimCard();
    const simCard02 = makeSimCard({ number: 952366605 });

    const res01 = await request(app).post('/api/sim-cards').set('authorization', `Bearer ${token}`).send(simCard01);
    const res02 = await request(app).post('/api/sim-cards').set('authorization', `Bearer ${token}`).send(simCard02);

    expect(res01.status).toBe(201);
    expect(res02.status).toBe(201);

    const fetchRes = await request(app).get('/api/sim-cards/').set('authorization', `Bearer ${token}`);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body).toHaveLength(2);
  });
});
