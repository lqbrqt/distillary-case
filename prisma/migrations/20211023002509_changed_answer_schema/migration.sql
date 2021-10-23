/*
  Warnings:

  - You are about to drop the column `code` on the `Question` table. All the data in the column will be lost.
  - Added the required column `inCompleteTestId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "inCompleteTestId" INTEGER NOT NULL,
ADD COLUMN     "questionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "code";

-- CreateTable
CREATE TABLE "CompleteTest" (
    "id" SERIAL NOT NULL,
    "rightAnswers" INTEGER NOT NULL,

    CONSTRAINT "CompleteTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_inCompleteTestId_fkey" FOREIGN KEY ("inCompleteTestId") REFERENCES "CompleteTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
