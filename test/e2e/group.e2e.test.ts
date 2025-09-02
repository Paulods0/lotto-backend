import app from '../../src';
import request from 'supertest';
import { token, userId } from '../setup';
import { makeGroup } from '../factories/make-group';

describe('E2E - Group', () => {
  it('should be able to create a group and fetch it', async () => {
    const group = makeGroup({
      users_id: [userId],
    });

    const res = await request(app).post('/api/groups').set('authorization', `Bearer ${token}`).send(group);

    expect(res.status).toBe(201);

    const groupId = res.body.id;
    const getRes = await request(app).get(`/api/groups/${groupId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
  });

  it('should be able to update a group and fetch it', async () => {
    const group = makeGroup({
      users_id: [userId],
    });

    const res = await request(app).post('/api/groups').set('authorization', `Bearer ${token}`).send(group);
    expect(res.status).toBe(201);

    const groupId = res.body.id;
    const updatedGroup = makeGroup({
      name: 'Updated group name',
      description: 'Updated group description',
      permissions: [
        {
          module: 'LICENCE',
          actions: ['READ', 'DELETE'],
        },
      ],
    });

    await request(app).put(`/api/groups/${groupId}`).set('authorization', `Bearer ${token}`).send(updatedGroup);
    const getRes = await request(app).get(`/api/groups/${groupId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe('Updated group name');
    expect(getRes.body.description).toBe('Updated group description');
  });

  it('should be able to delete a group', async () => {
    const group = makeGroup({
      users_id: [userId],
    });

    const res = await request(app).post('/api/groups').set('authorization', `Bearer ${token}`).send(group);
    expect(res.status).toBe(201);

    const groupId = res.body.id;

    const deleteRes = await request(app).delete(`/api/groups/${groupId}`).set('authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    const getRes = await request(app).get(`/api/groups/${groupId}`).set('authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(404);

    const fetchRes = await request(app).get('/api/groups/').set('authorization', `Bearer ${token}`);
    expect(fetchRes.body).toHaveLength(0);
  });

  it('should be able to fetch all groups', async () => {
    const group01 = makeGroup({
      users_id: [userId],
    });

    const group02 = makeGroup({
      users_id: [userId],
    });

    const res01 = await request(app).post('/api/groups').set('authorization', `Bearer ${token}`).send(group01);
    const res02 = await request(app).post('/api/groups').set('authorization', `Bearer ${token}`).send(group02);

    expect(res01.status).toBe(201);
    expect(res02.status).toBe(201);

    const fetchRes = await request(app).get('/api/groups/').set('authorization', `Bearer ${token}`);

    expect(fetchRes.body).toHaveLength(2);
    expect(fetchRes.body[0].memberships[0].user.first_name).toBe('Paulo');
    expect(fetchRes.body[1].memberships[0].user.first_name).toBe('Paulo');
  });
});
