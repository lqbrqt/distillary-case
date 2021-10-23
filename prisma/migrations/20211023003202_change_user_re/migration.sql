/*
  Warnings:

  - Added the required column `userId` to the `CompleteTest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompleteTest" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CompleteTest" ADD CONSTRAINT "CompleteTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
