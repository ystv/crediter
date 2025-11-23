/*
  Warnings:

  - The values [STARTED,BROWSER_LAUNCHED,IMAGE_SAVED,SCROLL_GENERATED,ENDCARD_ADDED,UPLOADED,TIDIED,READY] on the enum `CreditState` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CreditProgress" AS ENUM ('STARTED', 'BROWSER_LAUNCHED', 'IMAGE_SAVED', 'SCROLL_GENERATED', 'ENDCARD_ADDED', 'UPLOADED', 'TIDIED', 'READY');

-- AlterEnum
BEGIN;
CREATE TYPE "CreditState_new" AS ENUM ('WAITING', 'GENERATING', 'FAILED', 'OUTDATED', 'DELETED');
ALTER TABLE "public"."credits" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "credits" ALTER COLUMN "state" TYPE "CreditState_new" USING ("state"::text::"CreditState_new");
ALTER TYPE "CreditState" RENAME TO "CreditState_old";
ALTER TYPE "CreditState_new" RENAME TO "CreditState";
DROP TYPE "public"."CreditState_old";
ALTER TABLE "credits" ALTER COLUMN "state" SET DEFAULT 'WAITING';
COMMIT;

-- AlterTable
ALTER TABLE "credits" ADD COLUMN     "progress" "CreditProgress" NOT NULL DEFAULT 'STARTED',
ALTER COLUMN "state" SET DEFAULT 'WAITING';
