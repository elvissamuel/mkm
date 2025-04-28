-- AlterTable
ALTER TABLE "program" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "payment_amount" INTEGER,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "user_subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "amount_paid" INTEGER NOT NULL,
    "remaining_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_subscription_user_id_program_id_deleted_at_idx" ON "user_subscription"("user_id", "program_id", "deleted_at");

-- AddForeignKey
ALTER TABLE "program" ADD CONSTRAINT "program_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
