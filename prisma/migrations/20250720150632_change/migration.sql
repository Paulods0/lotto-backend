/*
  Warnings:

  - The values [pending] on the enum `AgentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgentStatus_new" AS ENUM ('ativo', 'inativo', 'pendente');
ALTER TABLE "agents" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "agents" ALTER COLUMN "status" TYPE "AgentStatus_new" USING ("status"::text::"AgentStatus_new");
ALTER TYPE "AgentStatus" RENAME TO "AgentStatus_old";
ALTER TYPE "AgentStatus_new" RENAME TO "AgentStatus";
DROP TYPE "AgentStatus_old";
ALTER TABLE "agents" ALTER COLUMN "status" SET DEFAULT 'pendente';
COMMIT;

-- AlterTable
ALTER TABLE "agents" ALTER COLUMN "status" SET DEFAULT 'pendente';
