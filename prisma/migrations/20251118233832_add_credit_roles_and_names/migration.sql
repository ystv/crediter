-- AlterEnum
ALTER TYPE "AssetState" ADD VALUE 'FAILED';

-- CreateTable
CREATE TABLE "credit_role_name" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "credit_role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_role_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "credit_role_name" ADD CONSTRAINT "credit_role_name_credit_role_id_fkey" FOREIGN KEY ("credit_role_id") REFERENCES "credit_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_role" ADD CONSTRAINT "credit_role_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
