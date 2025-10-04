/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_name_key";

-- AlterTable: Add user_id column as nullable first
ALTER TABLE "categories" ADD COLUMN "user_id" UUID;

-- Update existing categories to belong to the first user
UPDATE "categories" SET "user_id" = (SELECT "id" FROM "users" ORDER BY "created_at" LIMIT 1);

-- Make user_id NOT NULL after setting values
ALTER TABLE "categories" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_user_id_key" ON "categories"("name", "user_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
