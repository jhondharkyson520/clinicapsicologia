/*
  Warnings:

  - You are about to drop the `financeiro` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "sessoesContador" INTEGER;

-- DropTable
DROP TABLE "financeiro";

-- CreateTable
CREATE TABLE "caixa" (
    "id" TEXT NOT NULL,
    "valorPlano" DECIMAL(65,30) NOT NULL,
    "valorAberto" DECIMAL(65,30) NOT NULL,
    "valorPago" DECIMAL(65,30) NOT NULL,
    "dataOperacao" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "caixa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "caixa" ADD CONSTRAINT "caixa_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
