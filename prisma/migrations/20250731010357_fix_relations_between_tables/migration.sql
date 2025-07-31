/*
  Warnings:

  - A unique constraint covering the columns `[type_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subtype_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[area_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zone_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[admin_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[province_id]` on the table `pos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pos" ADD COLUMN     "admin_id" INTEGER,
ADD COLUMN     "area_id" INTEGER,
ADD COLUMN     "province_id" INTEGER,
ADD COLUMN     "subtype_id" INTEGER,
ADD COLUMN     "type_id" INTEGER,
ADD COLUMN     "zone_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "pos_type_id_key" ON "pos"("type_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_subtype_id_key" ON "pos"("subtype_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_area_id_key" ON "pos"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_zone_id_key" ON "pos"("zone_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_admin_id_key" ON "pos"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_province_id_key" ON "pos"("province_id");

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_subtype_id_fkey" FOREIGN KEY ("subtype_id") REFERENCES "subtypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "administrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
