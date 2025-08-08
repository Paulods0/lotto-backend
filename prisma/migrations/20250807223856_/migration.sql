/*
  Warnings:

  - The values [inativo] on the enum `AgentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREATE,UPDATE,DELETE,LOGIN,LOGOUT] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `licences` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `terminals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `training_date` to the `agents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `entity` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `delivery_date` to the `terminals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TerminalStatus" AS ENUM ('em_campo', 'formacao', 'stock', 'avaria');

-- CreateEnum
CREATE TYPE "public"."LicenceStatus" AS ENUM ('livre', 'em_uso');

-- CreateEnum
CREATE TYPE "public"."AuditEntity" AS ENUM ('pos', 'user', 'agent', 'licence', 'terminal');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."AgentStatus_new" AS ENUM ('ativo', 'negado', 'agendado', 'apto');
ALTER TABLE "public"."agents" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."agents" ALTER COLUMN "status" TYPE "public"."AgentStatus_new" USING ("status"::text::"public"."AgentStatus_new");
ALTER TYPE "public"."AgentStatus" RENAME TO "AgentStatus_old";
ALTER TYPE "public"."AgentStatus_new" RENAME TO "AgentStatus";
DROP TYPE "public"."AgentStatus_old";
ALTER TABLE "public"."agents" ALTER COLUMN "status" SET DEFAULT 'agendado';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuditAction_new" AS ENUM ('create', 'update', 'delete');
ALTER TABLE "public"."audit_logs" ALTER COLUMN "action" TYPE "public"."AuditAction_new" USING ("action"::text::"public"."AuditAction_new");
ALTER TYPE "public"."AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "public"."AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "public"."AuditAction_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."agents" ADD COLUMN     "training_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."audit_logs" ADD COLUMN     "user_email" TEXT NOT NULL,
DROP COLUMN "entity",
ADD COLUMN     "entity" "public"."AuditEntity" NOT NULL;

-- AlterTable
ALTER TABLE "public"."licences" DROP COLUMN "status",
ADD COLUMN     "status" "public"."LicenceStatus" NOT NULL DEFAULT 'livre';

-- AlterTable
ALTER TABLE "public"."terminals" ADD COLUMN     "delivery_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "device_id" TEXT,
ADD COLUMN     "note" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."TerminalStatus" DEFAULT 'stock';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "area_id" TEXT,
ADD COLUMN     "zone_id" TEXT;
