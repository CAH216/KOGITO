-- CreateEnum
CREATE TYPE "TutorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "status" "TutorStatus" NOT NULL DEFAULT 'PENDING';
