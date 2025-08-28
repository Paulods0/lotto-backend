import { Agent } from '@prisma/client';

export function makeAgent(override?: Partial<Agent>) {
  return {
    first_name: 'Agent',
    last_name: 'Lotaria',
    bi_number: '0123456789LA01',
    genre: 'masculino',
    phone_number: 941414141,
    agent_type: 'lotaria_nacional',
    ...override,
  } as Agent;
}
