/*
  Warnings:

  - The primary key for the `administrations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `administrations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `admin_id` column on the `licences` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "licences" DROP CONSTRAINT "licences_admin_id_fkey";

-- AlterTable
ALTER TABLE "administrations" DROP CONSTRAINT "administrations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "administrations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "licences" DROP COLUMN "admin_id",
ADD COLUMN     "admin_id" INTEGER;

-- AddForeignKey
ALTER TABLE "licences" ADD CONSTRAINT "licences_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "administrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
