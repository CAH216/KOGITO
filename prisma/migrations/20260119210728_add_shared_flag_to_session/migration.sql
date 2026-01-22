-- AlterTable
ALTER TABLE "KogitoSession" ADD COLUMN     "isSharedWithParent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedAt" TIMESTAMP(3);
