/*
  Warnings:

  - You are about to drop the column `concept` on the `KogitoConceptMastery` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentProfileId,conceptId]` on the table `KogitoConceptMastery` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "KogitoConceptMastery_studentProfileId_concept_key";

-- AlterTable
ALTER TABLE "KogitoConceptMastery" DROP COLUMN "concept",
ADD COLUMN     "conceptId" TEXT,
ADD COLUMN     "conceptSlug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'LOCKED';

-- CreateTable
CREATE TABLE "ConceptNode" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "radius" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptEdge" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PREREQUISITE',
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "ConceptEdge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConceptNode_slug_key" ON "ConceptNode"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptEdge_sourceId_targetId_key" ON "ConceptEdge"("sourceId", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "KogitoConceptMastery_studentProfileId_conceptId_key" ON "KogitoConceptMastery"("studentProfileId", "conceptId");

-- AddForeignKey
ALTER TABLE "KogitoConceptMastery" ADD CONSTRAINT "KogitoConceptMastery_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "ConceptNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptEdge" ADD CONSTRAINT "ConceptEdge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptEdge" ADD CONSTRAINT "ConceptEdge_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
