// import { PrismaClient } from '@prisma/client';
// import { connectOrDisconnect } from '../../utils/connect-disconnect';

// const prisma = new PrismaClient();

// export async function disassociatePreviousReference(tx: typeof prisma, model: 'pos' | 'terminal', id: string) {
//   return tx[model].update({
//     where: { id },
//     data: {
//       id_reference: null,
//       agent_id: null,
//     },
//   });
// }

// export async function associateAgentToPos(tx: typeof prisma, pos_id: string, agent_id: string, id_reference: number) {
//   const pos = await tx.pos.update({
//     where: { id: pos_id },
//     data: {
//       agent_id,
//       id_reference,
//     },
//   });

//   await tx.agent.update({
//     where: { id: agent_id },
//     data: {
//       ...connectOrDisconnect('area', pos.area_id),
//       ...connectOrDisconnect('zone', pos.zone_id),
//       ...connectOrDisconnect('province', pos.province_id),
//       ...connectOrDisconnect('city', pos.city_id),
//       ...connectOrDisconnect('type', pos.type_id),
//       ...connectOrDisconnect('subtype', pos.subtype_id),
//     },
//   });
// }

// export async function associateAgentToTerminal(
//   tx: typeof prisma,
//   terminal_id: string,
//   agent_id: string,
//   id_reference: number
// ) {
//   return tx.terminal.update({
//     where: { id: terminal_id },
//     data: {
//       agent_id,
//       id_reference,
//     },
//   });
// }
