import prisma from '../../lib/prisma';

export async function getFeaturesService() {
  const features = await prisma.feature.findMany();
  return features;
}
