-- AlterEnum
ALTER TYPE "AssetState" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "size" INTEGER NOT NULL DEFAULT -1;
