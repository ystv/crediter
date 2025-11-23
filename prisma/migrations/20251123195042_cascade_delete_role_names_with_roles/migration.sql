-- DropForeignKey
ALTER TABLE "public"."credit_role_name" DROP CONSTRAINT "credit_role_name_credit_role_id_fkey";

-- AddForeignKey
ALTER TABLE "credit_role_name" ADD CONSTRAINT "credit_role_name_credit_role_id_fkey" FOREIGN KEY ("credit_role_id") REFERENCES "credit_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
