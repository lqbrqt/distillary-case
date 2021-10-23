-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_inCompleteTestId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_parrentTestId_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "timeToComplete" INTEGER;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parrentTestId_fkey" FOREIGN KEY ("parrentTestId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_inCompleteTestId_fkey" FOREIGN KEY ("inCompleteTestId") REFERENCES "CompleteTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
