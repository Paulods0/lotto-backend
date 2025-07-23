/*
  Warnings:

  - A unique constraint covering the columns `[id_reference]` on the table `pos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pos_id_reference_key" ON "pos"("id_reference");
