import app from '../../src';
import request from 'supertest';
import { auth } from '../utils/auth';
import { makeAgent } from '../factories/make-agent';
import { Agent } from '../../src/features/agent/@types/agent.t';
import { CreateAgentDTO } from '../../src/features/agent/schemas/create-agent.schema';
import { createTerminal } from './terminal.e2e.test';
import { createPos } from './pos.e2e.test';

describe('E2E - Agent', () => {
  it('should be able to create an agent', async () => {
    const { id } = await createAgent();
    const agent = await getAgent(id);

    expect(agent.status).toBe('scheduled');
    expect(agent.first_name).toBe('Paulo');
    expect(agent.last_name).toBe('Luguenda');
    expect(agent.genre).toBe('male');
    expect(agent.agent_type).toBe('lotaria_nacional');
    expect(agent.phone_number).toBe(941685402);
    expect(agent.afrimoney_number).toBe(null);
  });

  it('should be able to update an agent', async () => {
    const { id } = await createAgent();

    const { id: postId } = await createPos();
    const { id: terminalId } = await createTerminal();

    const data = makeAgent({
      first_name: 'Ana',
      last_name: 'Silva',
      bi_number: '88888888LA88',
      genre: 'female',
      terminal_id: terminalId,
      pos_id: postId,
      phone_number: 929375582,
      training_date: new Date('2025-11-12'),
    });

    const { status } = await auth(request(app).put(`/api/agents/${id}`)).send(data);
    expect(status).toBe(200);

    const agent = await getAgent(id);

    console.log(agent);

    expect(agent.id).toBe(id);
    expect(agent.first_name).toBe('Ana');
    expect(agent.last_name).toBe('Silva');
    expect(agent.bi_number).toBe('88888888LA88');
    expect(agent.genre).toBe('female');
    expect(agent.status).toBe('scheduled');
    expect(agent.agent_type).toBe('lotaria_nacional');
    expect(agent.terminal).toBeDefined();
    expect(agent.pos).toBeDefined();
  });

  it('should be able to delete a agent', async () => {
    const { id } = await createAgent();

    const { status } = await auth(request(app).delete(`/api/agents/${id}`));
    expect(status).toBe(200);

    const agent = await getAgent(id);

    expect(agent.message).toBe('Agente não encontrado');
  });

  it('should be able to fetch all agents', async () => {
    await Promise.all([
      createAgent({
        first_name: 'Sebastião',
        last_name: 'Simão',
      }),
      createAgent({
        first_name: 'Délcio',
        last_name: 'Issanzo',
        type: 'revendedor',
      }),
    ]);

    const response = await auth(request(app).get('/api/agents'));
    const agentList: Agent[] = response.body;

    expect(response.status).toBe(200);
    expect(agentList).toHaveLength(2);

    expect(agentList[0].first_name).toBe('Sebastião');
    expect(agentList[0].id_reference).toBe(9001);

    expect(agentList[1].first_name).toBe('Délcio');
    expect(agentList[1].id_reference).toBe(1001);
  });
});

export async function createAgent(data?: Partial<CreateAgentDTO>) {
  const agent = makeAgent(data);
  const response = await auth(request(app).post('/api/agents')).send(agent);

  expect(response.status).toBe(201);

  return { id: response.body.id as string };
}

export async function getAgent(id: string) {
  const response = await auth(request(app).get(`/api/agents/${id}`));
  const agent = response.body as Agent & { message: string };
  return agent;
}
