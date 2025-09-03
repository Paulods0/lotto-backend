import app from '../../src';
import request from 'supertest';
import { token } from '../setup';
import { makeAgent } from '../factories/make-agent';
import { Agent } from '../../src/features/agent/@types/agent.t';

describe('E2E - Agent', () => {
  it('should be able to create a agent and fetch it', async () => {
    const agent = makeAgent();

    const res = await request(app).post('/api/agents').set('authorization', `Bearer ${token}`).send(agent);
    expect(res.status).toBe(201);

    const agentId = res.body.id;
    const getRes = await request(app).get(`/api/agents/${agentId}`).set('authorization', `Bearer ${token}`);
    const agentBody = getRes.body as Agent;

    expect(getRes.status).toBe(200);

    expect(agentBody.status).toBe('scheduled');
    expect(agentBody.first_name).toBe('Paulo');
    expect(agentBody.last_name).toBe('Luguenda');
    expect(agentBody.genre).toBe('male');
    expect(agentBody.agent_type).toBe('lotaria_nacional');
    expect(agentBody.phone_number).toBe(941685402);
    expect(agentBody.afrimoney_number).toBe(null);
  });

  it('should be able to update a agent and fetch it', async () => {
    const agent = makeAgent();
    const res = await request(app).post('/api/agents').set('authorization', `Bearer ${token}`).send(agent);
    expect(res.status).toBe(201);

    const agentId = res.body.id;
    const updatedAgent = makeAgent({
      first_name: 'Sebastião',
      last_name: 'Simão',
      bi_number: '88888888LA88',
      genre: 'female',
      phone_number: 929375582,
      training_date: new Date('2025-11-12'),
    });

    const updatedRes = await request(app)
      .put(`/api/agents/${agentId}`)
      .set('authorization', `Bearer ${token}`)
      .send(updatedAgent);
    expect(updatedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/agents/${agentId}`).set('authorization', `Bearer ${token}`);
    const agentBody = getRes.body as Agent;

    expect(getRes.status).toBe(200);
    expect(agentBody.id).toBe(agentId);
    expect(agentBody.first_name).toBe('Sebastião');
    expect(agentBody.last_name).toBe('Simão');
    expect(agentBody.bi_number).toBe('88888888LA88');
    expect(agentBody.genre).toBe('female');
    expect(agentBody.status).toBe('scheduled');
    expect(agentBody.agent_type).toBe('lotaria_nacional');
  });

  it('should be able to delete a agent and not fetch it', async () => {
    const agent = makeAgent();
    const res = await request(app).post('/api/agents').set('authorization', `Bearer ${token}`).send(agent);
    expect(res.status).toBe(201);

    const agentId = res.body.id;

    const deletedRes = await request(app).delete(`/api/agents/${agentId}`).set('authorization', `Bearer ${token}`);

    expect(deletedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/agents/${agentId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body.message).toBe('Agente não encontrado');
  });

  it('should be able to fetch all agents', async () => {
    const agent01 = makeAgent();
    const agent02 = makeAgent({
      first_name: 'Sebastião',
      last_name: 'Simão',
    });

    const res01 = await request(app).post('/api/agents').set('authorization', `Bearer ${token}`).send(agent01);
    expect(res01.status).toBe(201);

    const res02 = await request(app).post('/api/agents').set('authorization', `Bearer ${token}`).send(agent02);
    expect(res02.status).toBe(201);

    const fetchRes = await request(app).get('/api/agents/').set('authorization', `Bearer ${token}`);
    const fetchResBody: Agent[] = fetchRes.body;

    console.log(fetchResBody);

    expect(fetchRes.status).toBe(200);
    expect(fetchResBody).toHaveLength(2);

    expect(fetchResBody[0].first_name).toBe('Paulo');
    expect(fetchResBody[0].id_reference).toBe(9001);

    expect(fetchResBody[1].first_name).toBe('Sebastião');
    expect(fetchResBody[1].id_reference).toBe(9002);
  });
});
