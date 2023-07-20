/*
  Warnings:

  - You are about to drop the column `address` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[participantId]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aadhar` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegram_chat_id` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegram_userId` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participants" DROP COLUMN "address",
DROP COLUMN "name",
ADD COLUMN     "aadhar" TEXT NOT NULL,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "participantId" TEXT NOT NULL,
ADD COLUMN     "telegram_chat_id" TEXT NOT NULL,
ADD COLUMN     "telegram_userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "test";

-- CreateIndex
CREATE UNIQUE INDEX "participants_participantId_key" ON "participants"("participantId");
