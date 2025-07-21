/*
  Warnings:

  - Changed the type of `sim_card` on the `terminals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "terminals" DROP COLUMN "sim_card",
ADD COLUMN     "sim_card" INTEGER NOT NULL;
