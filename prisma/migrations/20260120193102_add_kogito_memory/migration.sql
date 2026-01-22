-- CreateTable
CREATE TABLE "KogitoMemory" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PEDAGOGICAL',
    "importance" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KogitoMemory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KogitoMemory" ADD CONSTRAINT "KogitoMemory_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "KogitoStudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
