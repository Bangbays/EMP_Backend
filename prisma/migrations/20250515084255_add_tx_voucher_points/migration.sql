-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "pointsUsed" INTEGER DEFAULT 0,
ADD COLUMN     "voucherId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
