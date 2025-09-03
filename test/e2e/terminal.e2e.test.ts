import app from '../../src';
import request from 'supertest';
import { auth } from '../utils/auth';
import { Terminal } from '../../src/features/terminal/@types/terminal.t';
import { makeTerminal, updateTerminal } from '../factories/make-terminal';
import { CreateTerminalDTO } from '../../src/features/terminal/schemas/create-terminal.schema';

describe('E2E - Terminal', () => {
  it('should be able to create a terminal and fetch it', async () => {
    const response = await createTerminal();
    const terminalId = response.id;

    const terminal = await getTerminal(terminalId);

    expect(terminal).toEqual(
      expect.objectContaining({
        id: terminalId,
        status: 'stock',
        device_id: 'device-id-example',
        serial: 'serial-number-example',
      })
    );
  });

  it('should be able to update a terminal and fetch it', async () => {
    const response = await createTerminal();
    const terminalId = response.id;

    const updatedTerminal = updateTerminal({
      note: 'terminal-note-example',
      leaved_at: new Date('2025-09-01'),
    });

    const updateRes = await auth(request(app).put(`/api/terminals/${terminalId}`)).send(updatedTerminal);
    expect(updateRes.status).toBe(200);

    const terminal = await getTerminal(terminalId);

    expect(terminal.id).toBe(terminalId);
    expect(terminal.note).toBe('terminal-note-example');
    expect(terminal.device_id).toBe('device-id-example');
    expect(terminal.leaved_at).toEqual(expect.stringMatching('2025-09-01'));
  });

  it('should be able to delete a terminal and not fetch it', async () => {
    const { id } = await createTerminal();

    const response = await auth(request(app).delete(`/api/terminals/${id}`));
    expect(response.status).toBe(200);

    const terminal = await getTerminal(id);

    expect(terminal.message).toBe('Terminal não encontrado');
  });

  it('should be able to delete many terminals', async () => {
    const { id: id01 } = await createTerminal({ serial: '1' });
    const { id: id02 } = await createTerminal({ serial: '2' });

    const data = { ids: [id01, id02] };

    const deletedRes = await auth(request(app).delete('/api/terminals/bulk')).send(data);

    expect(deletedRes.status).toBe(200);

    const fetchRes = await auth(request(app).get(`/api/terminals`));
    const fetchBody = fetchRes.body as Terminal;

    expect(fetchRes.status).toBe(200);
    expect(fetchBody).toHaveLength(0);
  });

  it('should be able to fetch all terminals', async () => {
    await createTerminal();
    await createTerminal({ serial: 'VFD952366605AE' });

    const response = await auth(request(app).get('/api/terminals/'));

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});

async function createTerminal(data?: Partial<CreateTerminalDTO>) {
  const terminal = makeTerminal(data);
  const res = await auth(request(app).post('/api/terminals')).send(terminal);
  expect(res.status).toBe(201);

  return res.body as Terminal;
}

async function getTerminal(id: string) {
  const response = await auth(request(app).get(`/api/terminals/${id}`));
  return response.body as Terminal & { message: string };
}
