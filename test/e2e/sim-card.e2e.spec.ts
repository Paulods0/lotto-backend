import { makeSimCard } from '../factories/make-sim-card';
import request from 'supertest';

describe('E2E - SimCard', () => {
  it('should be able to create a sim-card ', async () => {
    const simCard = makeSimCard();
  });
});
