import app from '../../src';
import request from 'supertest';
import { auth } from '../utils/auth';
import { makeSimCard } from '../factories/make-sim-card';
import { SimCard } from '../../src/features/sim-card/@types/sim-card.t';
import { CreateSimCardDTO } from '../../src/features/sim-card/schemas/create-sim-card.schema';
import { createTerminal } from './terminal.e2e.test';

describe('E2E - SimCards', () => {
  it('should be able to create a simCard and fetch it', async () => {
    const data = makeSimCard();
    const response = await auth(request(app).post('/api/sim-cards')).send(data);
    expect(response.status).toBe(201);

    const simCard = await getSimCard(response.body.id);

    expect(simCard).toBeDefined();
  });

  it('should be able to update a simCard and fetch it', async () => {
    const { id } = await createSimCard();
    const { id: terminalId } = await createTerminal();

    const data = makeSimCard({
      number: 952366605,
      pin: 9999,
      puk: 9898989,
      terminal_id: terminalId,
    });

    const { status } = await auth(request(app).put(`/api/sim-cards/${id}`)).send(data);
    expect(status).toBe(200);

    const simCard = await getSimCard(id);

    console.log(simCard);

    expect(simCard.pin).toBe(9999);
    expect(simCard.puk).toBe(9898989);
    expect(simCard.number).toBe(952366605);
    expect(simCard.terminal).toBeDefined();
    expect(simCard.terminal.status).toBe('stock');
  });

  it('should be able to delete a simCard and not fetch it', async () => {
    const { id } = await createSimCard();
    const { status } = await auth(request(app).delete(`/api/sim-cards/${id}`));
    expect(status).toBe(200);

    const simCard = await getSimCard(id);
    expect(simCard.message).toBe('Sim card não encontrado');
  });

  it('should be able to delete many a simCards', async () => {
    const { id: id01 } = await createSimCard();
    const { id: id02 } = await createSimCard();

    const data = { ids: [id01, id02] };

    const { status } = await auth(request(app).delete(`/api/sim-cards/bulk`)).send(data);
    expect(status).toBe(200);

    const simCard = await getSimCard(id01);
    expect(simCard.message).toBe('Sim card não encontrado');
  });

  it('should be able to fetch all simCards', async () => {
    await createSimCard();
    await createSimCard({ number: 952366605 });

    const response = await auth(request(app).get('/api/sim-cards'));

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});

export async function createSimCard(data?: Partial<CreateSimCardDTO>) {
  const simCard = makeSimCard(data);
  const response = await auth(request(app).post('/api/sim-cards')).send(simCard);
  expect(response.status).toBe(201);

  return response.body as SimCard;
}

export async function getSimCard(id: string) {
  const response = await auth(request(app).get(`/api/sim-cards/${id}`));
  return response.body as SimCard & { message: string };
}
