import app from '../../src';
import request from 'supertest';
import { auth } from '../utils/auth';
import { makePos } from '../factories/make-pos';
import { Pos } from '../../src/features/pos/@types/pos.t';
import { CreatePosDTO } from '../../src/features/pos/schemas/create-pos.schema';

describe('E2E - Pos', () => {
  it('should be able to create a pos', async () => {
    const { id } = await createPos();
    const pos = await getPos(id);

    expect(pos.status).toBe('pending');
    expect(pos.province.name).toBe('Luanda');
  });

  it('should be able to update a pos', async () => {
    const { id } = await createPos();

    const data = makePos({
      coordinates: '13,-12',
    });

    const { status } = await auth(request(app).put(`/api/pos/${id}`)).send(data);
    expect(status).toBe(200);

    const pos = await getPos(id);

    expect(pos.id).toBe(id);
    expect(pos.status).toBe('pending');
    expect(pos.coordinates).toEqual(expect.stringMatching('13,-12'));
  });

  it('should be able to delete a pos', async () => {
    const { id } = await createPos();

    const { status } = await auth(request(app).delete(`/api/pos/${id}`));
    expect(status).toBe(200);

    const pos = await getPos(id);
    expect(pos.message).toBe('Pos não encontrado');
  });

  it('should be able to delete many a pos`s ', async () => {
    const { id: id01 } = await createPos();
    const { id: id02 } = await createPos();

    const data = { ids: [id01, id02] };

    const { status } = await auth(request(app).delete(`/api/pos/bulk`)).send(data);
    expect(status).toBe(200);

    const pos = await getPos(id01);
    expect(pos.message).toBe('Pos não encontrado');
  });

  it('should be able to fetch all pos', async () => {
    await Promise.all([createPos({ coordinates: '10,000,-13,000' }), createPos({ coordinates: '12,000,-14,000' })]);

    const response = await auth(request(app).get('/api/pos'));
    const posList: Pos[] = response.body;

    expect(response.status).toBe(200);
    expect(posList).toHaveLength(2);
    expect(posList[0].coordinates).toBe('10,000,-13,000');
    expect(posList[1].coordinates).toBe('12,000,-14,000');
  });
});

async function createPos(data?: Partial<CreatePosDTO>) {
  const pos = makePos(data);
  const response = await auth(request(app).post('/api/pos')).send(pos);
  expect(response.status).toBe(201);

  return response.body as Pos;
}

async function getPos(id: string) {
  const response = await auth(request(app).get(`/api/pos/${id}`));
  return response.body as Pos & { message: string };
}
