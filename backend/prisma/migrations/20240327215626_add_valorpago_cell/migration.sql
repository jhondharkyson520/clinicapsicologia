/*
  Warnings:

  - Added the required column `valorPago` to the `caixa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "caixa" ADD COLUMN     "valorPago" DECIMAL(65,30) NOT NULL;
