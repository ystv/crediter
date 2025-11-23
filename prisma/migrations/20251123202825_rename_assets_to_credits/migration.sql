/*
  Warnings:

  - You are about to drop the `assets` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CreditState" AS ENUM ('NO_MEDIA', 'FAILED', 'UPLOADED', 'OUTDATED', 'DELETED');

-- DropTable
DROP TABLE "public"."assets";

-- DropEnum
DROP TYPE "public"."AssetState";

-- CreateTable
CREATE TABLE "credits" (
    "id" TEXT NOT NULL,
    "state" "CreditState" NOT NULL DEFAULT 'NO_MEDIA',
    "path" TEXT,
    "size" INTEGER NOT NULL DEFAULT -1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credits_pkey" PRIMARY KEY ("id")
);
