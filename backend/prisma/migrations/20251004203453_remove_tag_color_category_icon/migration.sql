/*
  Warnings:

  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "color";
