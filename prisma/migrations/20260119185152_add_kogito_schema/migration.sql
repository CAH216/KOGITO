-- CreateTable
CREATE TABLE "KogitoStudentProfile" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "learningStyle" TEXT,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "badges" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KogitoStudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KogitoSession" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "mode" TEXT NOT NULL DEFAULT 'STANDARD',
    "parentSummary" TEXT,

    CONSTRAINT "KogitoSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KogitoMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "step" TEXT,
    "sentiment" TEXT,
    "strategy" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KogitoMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KogitoConceptMastery" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "lastPracticed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KogitoConceptMastery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KogitoStudentProfile_studentId_key" ON "KogitoStudentProfile"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "KogitoConceptMastery_studentProfileId_concept_key" ON "KogitoConceptMastery"("studentProfileId", "concept");

-- AddForeignKey
ALTER TABLE "KogitoStudentProfile" ADD CONSTRAINT "KogitoStudentProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KogitoSession" ADD CONSTRAINT "KogitoSession_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "KogitoStudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KogitoMessage" ADD CONSTRAINT "KogitoMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "KogitoSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KogitoConceptMastery" ADD CONSTRAINT "KogitoConceptMastery_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "KogitoStudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
