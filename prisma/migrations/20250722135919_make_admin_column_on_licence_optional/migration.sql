-- DropForeignKey
ALTER TABLE "licences" DROP CONSTRAINT "licences_admin_id_fkey";

-- AlterTable
ALTER TABLE "licences" ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "licences" ADD CONSTRAINT "licences_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "administrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
