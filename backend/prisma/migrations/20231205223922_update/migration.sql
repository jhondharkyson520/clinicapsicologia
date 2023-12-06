/*
  Warnings:

  - You are about to drop the column `client_id` on the `financeiro` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "financeiro" DROP CONSTRAINT "financeiro_client_id_fkey";

-- DropIndex
DROP INDEX "financeiro_client_id_key";

-- AlterTable
ALTER TABLE "financeiro" DROP COLUMN "client_id";
