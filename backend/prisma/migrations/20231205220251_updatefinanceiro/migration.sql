/*
  Warnings:

  - You are about to drop the column `tipoPlano` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_id]` on the table `financeiro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_id` to the `financeiro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "tipoPlano";

-- AlterTable
ALTER TABLE "financeiro" ADD COLUMN     "client_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "financeiro_client_id_key" ON "financeiro"("client_id");

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
