import prisma from '../../lib/prisma';
import { BoundedBoxSchemaDTO } from '../../validations/pos/bounds';

export async function fecthBoundedPos(bounds: BoundedBoxSchemaDTO) {
  const pos = await prisma.pos.findMany({
    where: {},
  });

  return pos;
}
