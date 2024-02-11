/*
  Warnings:

  - You are about to drop the column `categoryId` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `verifyCodes` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_categoryId_fkey";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "verifyCodes" DROP COLUMN "deviceId";

-- DropTable
DROP TABLE "categories";
