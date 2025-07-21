-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('lotaria_nacional', 'revendedor');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('masculino', 'feminino');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ativo', 'inativo', 'pending');

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "id_reference" INTEGER,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "phone_number" INTEGER,
    "afrimoney_number" INTEGER,
    "agent_type" "AgentType" NOT NULL,
    "bi_number" TEXT,
    "status" "AgentStatus" NOT NULL DEFAULT 'pending',
    "pos_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terminals" (
    "id" TEXT NOT NULL,
    "id_reference" INTEGER,
    "serial" TEXT NOT NULL,
    "sim_card" TEXT NOT NULL,
    "pin" INTEGER,
    "puk" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "agent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terminals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos" (
    "id" TEXT NOT NULL,
    "id_reference" INTEGER,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "agent_id" TEXT,
    "licence_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licences" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creation_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "file" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "terminals_agent_id_key" ON "terminals"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_agent_id_key" ON "pos"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "pos_licence_id_key" ON "pos"("licence_id");

-- AddForeignKey
ALTER TABLE "terminals" ADD CONSTRAINT "terminals_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_licence_id_fkey" FOREIGN KEY ("licence_id") REFERENCES "licences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos" ADD CONSTRAINT "pos_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
