/*
  Warnings:

  - You are about to drop the column `memberName` on the `participants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "participants" DROP COLUMN "memberName";

-- CreateTable
CREATE TABLE "problemStatement" (
    "id" SERIAL NOT NULL,
    "problemStatementId" TEXT NOT NULL,
    "problemStatementTitle" TEXT NOT NULL,
    "problemStatementDescription" TEXT NOT NULL,
    "problemStatementDifficulty" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "problemStatement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "problemStatement_problemStatementId_key" ON "problemStatement"("problemStatementId");

-- AddForeignKey
ALTER TABLE "problemStatement" ADD CONSTRAINT "problemStatement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
