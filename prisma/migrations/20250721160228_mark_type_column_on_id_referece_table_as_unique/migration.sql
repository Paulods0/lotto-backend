/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `id_referecences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "id_referecences_type_key" ON "id_referecences"("type");
