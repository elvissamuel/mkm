/*
  Warnings:

  - You are about to drop the column `user_id` on the `program` table. All the data in the column will be lost.
  - You are about to drop the column `payment_amount` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "program" DROP CONSTRAINT "program_user_id_fkey";

-- AlterTable
ALTER TABLE "program" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "payment_amount",
ADD COLUMN     "expectations" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "mode_of_participation" TEXT;

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" TEXT,
    "reference" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "user_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
