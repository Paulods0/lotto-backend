/*
  Warnings:

  - You are about to drop the column `entity_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `audit_logs` table. All the data in the column will be lost.
  - Made the column `changes` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."audit_logs" DROP COLUMN "entity_id",
DROP COLUMN "metadata",
DROP COLUMN "user_id",
ALTER COLUMN "changes" SET NOT NULL;
