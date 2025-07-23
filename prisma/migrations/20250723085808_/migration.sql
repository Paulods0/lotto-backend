/*
  Warnings:

  - You are about to drop the column `name` on the `zones` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `zones` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `zones` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "zones_name_key";

-- AlterTable
ALTER TABLE "zones" DROP COLUMN "name",
ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "zones_number_key" ON "zones"("number");
