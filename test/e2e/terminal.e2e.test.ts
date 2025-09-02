import app from '../../src';
import request from 'supertest';
import { token } from '../setup';
import { Terminal } from '../../src/features/terminal/@types/terminal.t';
import { makeTerminal, updateTerminal } from '../factories/make-terminal';

describe('E2E - Terminal', () => {
  it('should be able to create a terminal and fetch it', async () => {
    const terminal = makeTerminal({ serial: 'serial-number-example' });

    const res = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal);
    expect(res.status).toBe(201);

    const terminalId = res.body.id;
    const getRes = await request(app).get(`/api/terminals/${terminalId}`).set('authorization', `Bearer ${token}`);
    const terminalBody = getRes.body as Terminal;

    expect(getRes.status).toBe(200);
    expect(terminalBody.status).toBe('stock');
    expect(terminalBody.device_id).toBe('device-id-example');
    expect(terminalBody.serial).toBe('serial-number-example');
  });

  it('should be able to update a terminal and fetch it', async () => {
    const terminal = makeTerminal();
    const res = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal);
    expect(res.status).toBe(201);

    const terminalId = res.body.id;
    const updatedTerminal = updateTerminal({
      note: 'terminal-note-example',
      leaved_at: new Date('2025-09-01'),
    });

    const updatedRes = await request(app)
      .put(`/api/terminals/${terminalId}`)
      .set('authorization', `Bearer ${token}`)
      .send(updatedTerminal);
    expect(updatedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/terminals/${terminalId}`).set('authorization', `Bearer ${token}`);
    const terminalBody = getRes.body as Terminal;

    expect(getRes.status).toBe(200);
    expect(terminalBody.device_id).toBe('device-id-example');
    expect(terminalBody.note).toBe('terminal-note-example');
    expect(terminalBody.leaved_at).toContain('2025-09-01');
    expect(terminalBody.id).toBe(terminalId);
  });

  it('should be able to delete a terminal and not fetch it', async () => {
    const terminal = makeTerminal();
    const res = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal);
    expect(res.status).toBe(201);

    const terminalId = res.body.id;

    const deletedRes = await request(app)
      .delete(`/api/terminals/${terminalId}`)
      .set('authorization', `Bearer ${token}`);

    expect(deletedRes.status).toBe(200);

    const getRes = await request(app).get(`/api/terminals/${terminalId}`).set('authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body.message).toBe('Terminal não encontrado');
  });

  it('should be able to fetch all terminals', async () => {
    const terminal01 = makeTerminal();
    const terminal02 = makeTerminal({ serial: 'VFD952366605AE' });

    const res01 = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal01);
    expect(res01.status).toBe(201);

    const res02 = await request(app).post('/api/terminals').set('authorization', `Bearer ${token}`).send(terminal02);
    expect(res02.status).toBe(201);

    const fetchRes = await request(app).get('/api/terminals/').set('authorization', `Bearer ${token}`);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body).toHaveLength(2);
  });
});
