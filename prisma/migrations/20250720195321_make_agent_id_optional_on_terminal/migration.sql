-- DropForeignKey
ALTER TABLE "terminals" DROP CONSTRAINT "terminals_agent_id_fkey";

-- AlterTable
ALTER TABLE "terminals" ALTER COLUMN "agent_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "terminals" ADD CONSTRAINT "terminals_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
