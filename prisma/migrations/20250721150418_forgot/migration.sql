/*
  Warnings:

  - Added the required column `reference` to the `licences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "licences" ADD COLUMN     "reference" TEXT NOT NULL;
