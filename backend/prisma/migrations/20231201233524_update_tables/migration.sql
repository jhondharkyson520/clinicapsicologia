/*
  Warnings:

  - You are about to drop the column `mensalidade` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `vencimento` on the `clients` table. All the data in the column will be lost.
  - Added the required column `sessoesContador` to the `agenda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataVencimento` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planoFamiliar` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeSessoes` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPlano` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorPlano` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agenda" ADD COLUMN     "sessoesContador" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "mensalidade",
DROP COLUMN "vencimento",
ADD COLUMN     "dataVencimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "planoFamiliar" TEXT NOT NULL,
ADD COLUMN     "quantidadeSessoes" INTEGER NOT NULL,
ADD COLUMN     "tipoPlano" TEXT NOT NULL,
ADD COLUMN     "valorPlano" DECIMAL(65,30) NOT NULL;
