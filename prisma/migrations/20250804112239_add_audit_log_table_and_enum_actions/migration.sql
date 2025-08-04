/*
  Warnings:

  - Changed the type of `action` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- AlterTable
ALTER TABLE "public"."audit_logs" ADD COLUMN     "changes" JSONB,
DROP COLUMN "action",
ADD COLUMN     "action" "public"."AuditAction" NOT NULL,
ALTER COLUMN "metadata" DROP NOT NULL;
