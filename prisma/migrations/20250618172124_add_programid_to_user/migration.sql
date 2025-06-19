/*
  Warnings:

  - A unique constraint covering the columns `[program_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "program_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_program_id_key" ON "user"("program_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
