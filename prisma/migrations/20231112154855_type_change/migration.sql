/*
  Warnings:

  - Changed the type of `clientNumber` on the `Form` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "clientNumber",
ADD COLUMN     "clientNumber" INTEGER NOT NULL;
