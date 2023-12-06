-- CreateTable
CREATE TABLE "financeiro" (
    "id" TEXT NOT NULL,
    "faturamentoMensal" DECIMAL(65,30) NOT NULL,
    "faturamentoAnual" DECIMAL(65,30) NOT NULL,
    "planosAtrasados" INTEGER NOT NULL,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financeiro_pkey" PRIMARY KEY ("id")
);
