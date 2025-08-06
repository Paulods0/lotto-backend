/*
  Warnings:

  - You are about to drop the column `latitude` on the `licences` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `licences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."licences" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "coordinates" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "limit" INTEGER NOT NULL DEFAULT 1;
