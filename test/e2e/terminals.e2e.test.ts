import app from '../../src';
import request from 'supertest';
import { makeTerminal } from '../factories/make-terminal';
import { token } from '../setup';

describe('E2E - Terminals', () => {
  it('should be able to create an terminal', async () => {
    const terminal = makeTerminal();
    const res = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal);

    expect(res.status).toBe(201);

    const terminalId = res.body.data.id;
    const getRes = await request(app).get(`/api/terminals/${terminalId}`).set('authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
  });

  it('should be able to update an existing terminal', async () => {
    const terminal = makeTerminal({ serial: 'FE89824WFS' });
    const res = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal);
    const terminalId = res.body.data.id;

    const updatedSerial = 'PAULO-098765';
    await request(app)
      .put(`/api/terminals/${terminalId}`)
      .set('authorization', `Bearer ${token}`)
      .send({ serial: updatedSerial });

    const getRes = await request(app).get(`/api/terminals/${terminalId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.serial).toBe(updatedSerial);
  });

  it('should be able to get a single terminal', async () => {
    const sim_card = 950555500;
    const terminal = makeTerminal({ sim_card });
    const res = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal);
    const terminalId = res.body.data.id;

    const getRes = await request(app).get(`/api/terminals/${terminalId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.sim_card).toBe(sim_card);
  });

  it('should be able to fetch many terminals', async () => {
    const terminal01 = makeTerminal({ sim_card: 942424242, serial: 'OLD-7654678' });
    const terminal02 = makeTerminal({ sim_card: 941414141, serial: 'NEW-7654678' });

    await Promise.all([
      request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal01),
      request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal02),
    ]);

    const getRes = await request(app).get(`/api/terminals`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveLength(2);
  });

  it('should be able to fetch many terminals with filters', async () => {
    const terminal01 = makeTerminal({ sim_card: 940404040, serial: 'FIRST-8765G34FW2' });
    const terminal02 = makeTerminal({ sim_card: 941414141, serial: 'SECOND-8765G34FW2' });
    const terminal03 = makeTerminal({ sim_card: 942424242, serial: 'THIRD-8765G34FW2' });

    await Promise.all([
      request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal01),
      request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal02),
      request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal03),
    ]);

    const getRes = await request(app).get(`/api/terminals?limit=2`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveLength(2);
  });
});
