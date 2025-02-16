/*
  Warnings:

  - You are about to drop the column `options` on the `Poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "options",
ADD COLUMN     "option" TEXT[],
ALTER COLUMN "pollCount" SET DEFAULT ARRAY[0, 0, 0, 0]::INTEGER[];
