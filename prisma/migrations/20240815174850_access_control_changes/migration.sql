/*
  Warnings:

  - You are about to drop the column `isSubmitted` on the `BookStage` table. All the data in the column will be lost.
  - You are about to drop the column `isWorking` on the `BookStage` table. All the data in the column will be lost.
  - You are about to drop the column `requirement` on the `BookStage` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `BookStage` table. All the data in the column will be lost.
  - You are about to drop the column `bookStageId` on the `BookStageImageMap` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedByUserId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `des` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the `ResourceAttributePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourcePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoleMap` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[draftImageId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookId,stageId]` on the table `BookStage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookId,userId]` on the table `BookUserMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId,name,value]` on the table `ResourceAttribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileImageId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stageId` to the `BookStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bkStgId` to the `BookStageImageMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedBy` to the `Image` table without a default value. This is not possible if the table is not empty.
  - The required column `accessToken` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `isActive` on the `UserImageMap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BookStageImageMap" DROP CONSTRAINT "BookStageImageMap_bookStageId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_uploadedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceAttributePermission" DROP CONSTRAINT "ResourceAttributePermission_resourceAttributeId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceAttributePermission" DROP CONSTRAINT "ResourceAttributePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "ResourcePermission" DROP CONSTRAINT "ResourcePermission_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "ResourcePermission" DROP CONSTRAINT "ResourcePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleMap" DROP CONSTRAINT "UserRoleMap_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleMap" DROP CONSTRAINT "UserRoleMap_userId_fkey";

-- DropIndex
DROP INDEX "FK_BOOK_ID_STAGE_idx";

-- DropIndex
DROP INDEX "FK_IMAGE_UPLOADED_BY_USER_ID_idx";

-- DropIndex
DROP INDEX "Image_slug_key";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "draftImageId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookStage" DROP COLUMN "isSubmitted",
DROP COLUMN "isWorking",
DROP COLUMN "requirement",
DROP COLUMN "stage",
ADD COLUMN     "isEditing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "stageId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookStageImageMap" DROP COLUMN "bookStageId",
ADD COLUMN     "bkStgId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookUserMap" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "slug",
DROP COLUMN "uploaded",
DROP COLUMN "uploadedByUserId",
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "uploadedBy" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "des",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ResourceAttribute" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profileImageId" TEXT,
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserImageMap" DROP COLUMN "isActive",
ADD COLUMN     "isActive" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "ResourceAttributePermission";

-- DropTable
DROP TABLE "ResourcePermission";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "UserRoleMap";

-- CreateTable
CREATE TABLE "BookStageManuscript" (
    "id" TEXT NOT NULL,
    "bkStgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "iSAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookStageManuscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookStageManuscriptPage" (
    "id" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "bkStgManuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "BookStageManuscriptPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookStageManuscriptActivity" (
    "id" TEXT NOT NULL,
    "bkStgManuId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookStageManuscriptActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleMaster" (
    "id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAction" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "action" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceActionPermission" (
    "id" SERIAL NOT NULL,
    "resourceActionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceActionPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAttributeAction" (
    "id" SERIAL NOT NULL,
    "resourceAttributeId" INTEGER NOT NULL,
    "action" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceAttributeAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAttributeActionPermission" (
    "id" SERIAL NOT NULL,
    "resourceAttributeActionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceAttributeActionPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceActionDepend" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "resourceActionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceId" INTEGER,
    "resourceAttributeId" INTEGER,

    CONSTRAINT "ResourceActionDepend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAttributeActionDepend" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "resourceAttibuteActionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceId" INTEGER,
    "resourceAttributeId" INTEGER,

    CONSTRAINT "ResourceAttributeActionDepend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MANUSCRIPT_BKSTG_PRNT_idx" ON "BookStageManuscript"("bkStgId", "parentId");

-- CreateIndex
CREATE INDEX "BookStageManuscriptPage_bkStgManuId_page_idx" ON "BookStageManuscriptPage"("bkStgManuId", "page");

-- CreateIndex
CREATE UNIQUE INDEX "BookStageManuscriptPage_page_bkStgManuId_key" ON "BookStageManuscriptPage"("page", "bkStgManuId");

-- CreateIndex
CREATE INDEX "BookStageManuscriptActivity_bkStgManuId_idx" ON "BookStageManuscriptActivity"("bkStgManuId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleMaster_role_key" ON "RoleMaster"("role");

-- CreateIndex
CREATE INDEX "FK_RESOURCE_ID_ACTION_idx" ON "ResourceAction"("resourceId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceAction_resourceId_action_key" ON "ResourceAction"("resourceId", "action");

-- CreateIndex
CREATE INDEX "FK_RAP_RESOURCE_ID__ROLE_ID_idx" ON "ResourceActionPermission"("resourceActionId", "roleId");

-- CreateIndex
CREATE INDEX "FK_RESOURCE_ATTRIBUTE_ID_ACTION_idx" ON "ResourceAttributeAction"("resourceAttributeId", "action");

-- CreateIndex
CREATE INDEX "FK_RAAP_RESOURCE_ID__ROLE_ID_idx" ON "ResourceAttributeActionPermission"("resourceAttributeActionId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceActionDepend_type_value_resourceActionId_key" ON "ResourceActionDepend"("type", "value", "resourceActionId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceAttributeActionDepend_type_value_resourceAttibuteAc_key" ON "ResourceAttributeActionDepend"("type", "value", "resourceAttibuteActionId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_draftImageId_key" ON "Book"("draftImageId");

-- CreateIndex
CREATE INDEX "Book_id_idx" ON "Book"("id");

-- CreateIndex
CREATE INDEX "FK_BOOK_ID_STAGE_idx" ON "BookStage"("bookId", "stageId");

-- CreateIndex
CREATE UNIQUE INDEX "BookStage_bookId_stageId_key" ON "BookStage"("bookId", "stageId");

-- CreateIndex
CREATE INDEX "BookStageImageMap_bkStgId_idx" ON "BookStageImageMap"("bkStgId");

-- CreateIndex
CREATE UNIQUE INDEX "BookUserMap_bookId_userId_key" ON "BookUserMap"("bookId", "userId");

-- CreateIndex
CREATE INDEX "FK_IMAGE_UPLOADED_BY_USER_ID_idx" ON "Image"("uploadedBy");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceAttribute_resourceId_name_value_key" ON "ResourceAttribute"("resourceId", "name", "value");

-- CreateIndex
CREATE UNIQUE INDEX "User_accessToken_key" ON "User"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileImageId_key" ON "User"("profileImageId");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_accessToken_idx" ON "User"("accessToken");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_draftImageId_fkey" FOREIGN KEY ("draftImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageImageMap" ADD CONSTRAINT "BookStageImageMap_bkStgId_fkey" FOREIGN KEY ("bkStgId") REFERENCES "BookStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageManuscript" ADD CONSTRAINT "BookStageManuscript_bkStgId_fkey" FOREIGN KEY ("bkStgId") REFERENCES "BookStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageManuscript" ADD CONSTRAINT "BookStageManuscript_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BookStageManuscript"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageManuscriptPage" ADD CONSTRAINT "BookStageManuscriptPage_bkStgManuId_fkey" FOREIGN KEY ("bkStgManuId") REFERENCES "BookStageManuscript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageManuscriptPage" ADD CONSTRAINT "BookStageManuscriptPage_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageManuscriptActivity" ADD CONSTRAINT "BookStageManuscriptActivity_bkStgManuId_fkey" FOREIGN KEY ("bkStgManuId") REFERENCES "BookStageManuscript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStageManuscriptActivity" ADD CONSTRAINT "BookStageManuscriptActivity_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAction" ADD CONSTRAINT "ResourceAction_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceActionPermission" ADD CONSTRAINT "ResourceActionPermission_resourceActionId_fkey" FOREIGN KEY ("resourceActionId") REFERENCES "ResourceAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceActionPermission" ADD CONSTRAINT "ResourceActionPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributeAction" ADD CONSTRAINT "ResourceAttributeAction_resourceAttributeId_fkey" FOREIGN KEY ("resourceAttributeId") REFERENCES "ResourceAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributeActionPermission" ADD CONSTRAINT "ResourceAttributeActionPermission_resourceAttributeActionI_fkey" FOREIGN KEY ("resourceAttributeActionId") REFERENCES "ResourceAttributeAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributeActionPermission" ADD CONSTRAINT "ResourceAttributeActionPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceActionDepend" ADD CONSTRAINT "ResourceActionDepend_resourceActionId_fkey" FOREIGN KEY ("resourceActionId") REFERENCES "ResourceAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceActionDepend" ADD CONSTRAINT "ResourceActionDepend_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceActionDepend" ADD CONSTRAINT "ResourceActionDepend_resourceAttributeId_fkey" FOREIGN KEY ("resourceAttributeId") REFERENCES "ResourceAttribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributeActionDepend" ADD CONSTRAINT "ResourceAttributeActionDepend_resourceAttibuteActionId_fkey" FOREIGN KEY ("resourceAttibuteActionId") REFERENCES "ResourceAttributeAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributeActionDepend" ADD CONSTRAINT "ResourceAttributeActionDepend_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributeActionDepend" ADD CONSTRAINT "ResourceAttributeActionDepend_resourceAttributeId_fkey" FOREIGN KEY ("resourceAttributeId") REFERENCES "ResourceAttribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
