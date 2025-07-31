/*
  Warnings:

  - A unique constraint covering the columns `[city_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pos" ADD COLUMN     "city_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "pos_city_id_key" ON "pos"("city_id");

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
