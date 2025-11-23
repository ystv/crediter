-- CreateEnum
CREATE TYPE "AssetState" AS ENUM ('NO_MEDIA', 'UPLOADED', 'OUTDATED');

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" "AssetState" NOT NULL DEFAULT 'NO_MEDIA',
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);
