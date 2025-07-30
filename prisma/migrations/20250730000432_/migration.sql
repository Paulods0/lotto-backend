/*
  Warnings:

  - The primary key for the `areas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `areas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `cities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cities` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `provinces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `provinces` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subtypes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subtypes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `types` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `zones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `zones` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `province_id` on the `cities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type_id` on the `subtypes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `area_id` on the `zones` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_province_id_fkey";

-- DropForeignKey
ALTER TABLE "subtypes" DROP CONSTRAINT "subtypes_type_id_fkey";

-- DropForeignKey
ALTER TABLE "zones" DROP CONSTRAINT "zones_area_id_fkey";

-- AlterTable
ALTER TABLE "areas" DROP CONSTRAINT "areas_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "areas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cities" DROP CONSTRAINT "cities_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "province_id",
ADD COLUMN     "province_id" INTEGER NOT NULL,
ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "provinces" DROP CONSTRAINT "provinces_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "provinces_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subtypes" DROP CONSTRAINT "subtypes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "type_id",
ADD COLUMN     "type_id" INTEGER NOT NULL,
ADD CONSTRAINT "subtypes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "types" DROP CONSTRAINT "types_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "zones" DROP CONSTRAINT "zones_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "area_id",
ADD COLUMN     "area_id" INTEGER NOT NULL,
ADD CONSTRAINT "zones_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtypes" ADD CONSTRAINT "subtypes_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
