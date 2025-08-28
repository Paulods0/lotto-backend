import { Terminal } from '@prisma/client';

export function makeTerminal(override?: Partial<Terminal>) {
  return {
    serial: 'VD2942NDALNF13',
    sim_card: 941685402,
    pin: 1234,
    puk: 1234567,
    ...override,
  } as Terminal;
}
