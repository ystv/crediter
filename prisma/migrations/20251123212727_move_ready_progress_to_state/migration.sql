/*
  Warnings:

  - The values [READY] on the enum `CreditProgress` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CreditProgress_new" AS ENUM ('STARTED', 'BROWSER_LAUNCHED', 'IMAGE_SAVED', 'SCROLL_GENERATED', 'ENDCARD_ADDED', 'UPLOADED', 'TIDIED');
ALTER TABLE "public"."credits" ALTER COLUMN "progress" DROP DEFAULT;
ALTER TABLE "credits" ALTER COLUMN "progress" TYPE "CreditProgress_new" USING ("progress"::text::"CreditProgress_new");
ALTER TYPE "CreditProgress" RENAME TO "CreditProgress_old";
ALTER TYPE "CreditProgress_new" RENAME TO "CreditProgress";
DROP TYPE "public"."CreditProgress_old";
ALTER TABLE "credits" ALTER COLUMN "progress" SET DEFAULT 'STARTED';
COMMIT;

-- AlterEnum
ALTER TYPE "CreditState" ADD VALUE 'READY';
