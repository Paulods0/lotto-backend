import app from '../../src';
import request from 'supertest';
import { token, userId } from '../setup';
import { makeGroup } from '../factories/make-group';
import { auth } from '../utils/auth';
import { Group } from '../../src/features/group/@types/group.t';
import { CreateGroupDTO } from '../../src/features/group/schemas/create.schema';

describe('E2E - Group', () => {
  it('should be able to create a group', async () => {
    const { id } = await createGroup();
    const group = await getGroup(id);
    console.log(group);

    expect(group.name).toBe('Development');
    expect(group.memberships).toHaveLength(1);
  });

  it('should be able to update a group', async () => {
    const { id } = await createGroup();

    const data = makeGroup({
      name: 'T.I',
      description: 'Updated description',
      permissions: [
        {
          module: 'LICENCE',
          actions: ['READ', 'DELETE'],
        },
      ],
    });

    const { status } = await auth(request(app).put(`/api/groups/${id}`).send(data));
    const group = await getGroup(id);

    expect(status).toBe(200);
    expect(group.name).toBe('T.I');
    expect(group.description).toBe('Updated description');
  });

  it('should be able to delete a group', async () => {
    const { id } = await createGroup();

    const { status } = await auth(request(app).delete(`/api/groups/${id}`));
    expect(status).toBe(200);

    const group = await getGroup(id);

    expect(group.message).toBe('Grupo não encontrado');
  });

  it('should be able to fetch all groups', async () => {
    await Promise.all([
      createGroup({
        name: 'Marketing',
        description: 'Marketing group',
      }),
      createGroup({
        name: 'R.H',
        description: 'RH group',
      }),
    ]);

    const response = await auth(request(app).get('/api/groups'));
    const groupsList: Group[] = response.body;

    expect(response.status).toBe(200);
    expect(groupsList).toHaveLength(2);
    expect(groupsList[0].name).toBe('R.H');
    expect(groupsList[1].name).toBe('Marketing');
  });
});

async function createGroup(data?: Partial<CreateGroupDTO>) {
  const group = makeGroup(data);
  const res = await auth(request(app).post('/api/groups')).send(group);
  expect(res.status).toBe(201);

  return res.body as Group;
}

async function getGroup(id: string) {
  const response = await auth(request(app).get(`/api/groups/${id}`));
  return response.body as Group & { message: string };
}
