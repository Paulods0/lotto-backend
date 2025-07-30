import prisma from '../../lib/prisma';
import { CoordinatesSchemaDTO } from '../../validations/pos-schemas/coordinates';

export async function fecthManyPosWithCoordinates(cordinates: CoordinatesSchemaDTO) {
  const { neLat, neLng, swLat, swLng } = cordinates;

  const pos = await prisma.pos.findMany({
    where: {
      latitude: { gte: swLat, lte: neLat },
      longitude: { gte: swLng, lte: neLng },
    },
  });

  return pos;
}
