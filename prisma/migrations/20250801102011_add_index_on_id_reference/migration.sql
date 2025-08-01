/*
  Warnings:

  - A unique constraint covering the columns `[id_reference]` on the table `agents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_reference]` on the table `terminals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "agents_id_reference_key" ON "agents"("id_reference");

-- CreateIndex
CREATE UNIQUE INDEX "terminals_id_reference_key" ON "terminals"("id_reference");
