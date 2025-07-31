-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "province_id" INTEGER,
ADD COLUMN     "subtype_id" INTEGER;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_subtype_id_fkey" FOREIGN KEY ("subtype_id") REFERENCES "subtypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
