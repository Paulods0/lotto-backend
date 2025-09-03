import app from '../../src';
import request from 'supertest';
import { adminId, token } from '../setup';
import { Licence } from '../../src/features/licence/@types/licence.t';
import { makeLicence } from '../factories/make-licence';

describe('E2E - Licence', () => {
  it('should be able to create a licence and fetch it', async () => {
    const licence = makeLicence({ limit: 3, number: '6757', description: 'test', admin_id: adminId });

    const res = await request(app).post('/api/licences').set('authorization', `Bearer ${token}`).send(licence);
    expect(res.status).toBe(201);

    const licenceId = res.body.id;
    const getRes = await request(app).get(`/api/licences/${licenceId}`).set('authorization', `Bearer ${token}`);
    const licenceBody = getRes.body as Licence;

    //

    expect(getRes.status).toBe(200);
    expect(licenceBody.number).toBe('6757');
    expect(licenceBody.description).toBe('test');
    expect(licenceBody.limit).toBe(3);
    expect(licenceBody.emitted_at).toBe('2025-08-10T00:00:00.000Z');
    expect(licenceBody.status).toBe('free');
  });

  it('should be able to update a licence and fetch it', async () => {
    const licence = makeLicence({
      admin_id: adminId,
    });
    const res = await request(app).post('/api/licences').set('authorization', `Bearer ${token}`).send(licence);
    expect(res.status).toBe(201);

    const licenceId = res.body.id;
    const updatedLicence = makeLicence({
      admin_id: adminId,
      number: 'num-updated',
      description: 'desc-updated',
      emitted_at: new Date('2020-10-10'),
      expires_at: new Date('2021-10-11'),
      limit: 10,
    });

    const updatedRes = await request(app)
      .put(`/api/licences/${licenceId}`)
      .set('authorization', `Bearer ${token}`)
      .send(updatedLicence);
    expect(updatedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/licences/${licenceId}`).set('authorization', `Bearer ${token}`);
    const licenceBody = getRes.body as Licence;

    expect(getRes.status).toBe(200);
    expect(licenceBody.id).toBe(licenceId);
    expect(licenceBody.number).toBe('num-updated');
    expect(licenceBody.description).toBe('desc-updated');
    expect(licenceBody.limit).toBe(10);
    expect(licenceBody.emitted_at).toBe('2020-10-10T00:00:00.000Z');
    expect(licenceBody.expires_at).toBe('2021-10-11T00:00:00.000Z');
  });

  it('should be able to delete a licence and not fetch it', async () => {
    const licence = makeLicence({ admin_id: adminId });
    const res = await request(app).post('/api/licences').set('authorization', `Bearer ${token}`).send(licence);
    expect(res.status).toBe(201);

    const licenceId = res.body.id;
    const deletedRes = await request(app).delete(`/api/licences/${licenceId}`).set('authorization', `Bearer ${token}`);

    expect(deletedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/licences/${licenceId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body.message).toBe('Licença não encontrada');
  });

  it('should be able to fetch all licences', async () => {
    const licence01 = makeLicence({ admin_id: adminId });

    const res01 = await request(app).post('/api/licences').set('authorization', `Bearer ${token}`).send(licence01);
    expect(res01.status).toBe(201);

    const fetchRes = await request(app).get('/api/licences/').set('authorization', `Bearer ${token}`);
    const fetchResBody: Licence[] = fetchRes.body;

    expect(fetchRes.status).toBe(200);
    expect(fetchResBody).toHaveLength(1);
  });
});
