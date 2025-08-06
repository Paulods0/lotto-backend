import prisma from '../../lib/prisma';
import { BoundedBoxSchemaDTO } from '../../validations/pos/bounds';

export async function fecthBoundedPos(bounds: BoundedBoxSchemaDTO) {
  const { minLat, maxLat, minLng, maxLng } = bounds;

  const pos = await prisma.pos.findMany({
    where: {
      latitude: { gte: parseFloat(minLat), lte: parseFloat(maxLat) },
      longitude: { gte: parseFloat(minLng), lte: parseFloat(maxLng) },
    },
  });

  return pos;
}
