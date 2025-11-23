/*
  Warnings:

  - You are about to drop the column `date` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "date",
DROP COLUMN "name";
