/*
  Warnings:

  - You are about to drop the `id_referecences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."id_referecences";

-- CreateTable
CREATE TABLE "public"."id_references" (
    "id" SERIAL NOT NULL,
    "counter" SERIAL NOT NULL,
    "type" "public"."AgentType" NOT NULL,

    CONSTRAINT "id_references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "id_references_type_key" ON "public"."id_references"("type");
