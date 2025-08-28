import { SimCard } from '@prisma/client';

export function makeSimCard(override?: Partial<SimCard>) {
  return {
    number: 941685402,
    pin: 1234,
    puk: 1234567,
    ...override,
  } as SimCard;
}
