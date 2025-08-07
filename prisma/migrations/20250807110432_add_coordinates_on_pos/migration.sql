/*
  Warnings:

  - You are about to drop the column `latitude` on the `pos` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `pos` table. All the data in the column will be lost.
  - Added the required column `coordinates` to the `pos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."pos" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "coordinates" TEXT NOT NULL;
