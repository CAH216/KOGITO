-- AlterTable
ALTER TABLE "KogitoStudentProfile" ADD COLUMN     "interests" JSONB,
ADD COLUMN     "onboardingDone" BOOLEAN NOT NULL DEFAULT false;
