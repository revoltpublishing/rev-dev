/*
  Warnings:

  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Role` table. All the data in the column will be lost.
  - Changed the type of `roleId` on the `ResourceAttributePermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `ResourcePermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `UserRoleMap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ResourceAttributePermission" DROP CONSTRAINT "ResourceAttributePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "ResourcePermission" DROP CONSTRAINT "ResourcePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleMap" DROP CONSTRAINT "UserRoleMap_roleId_fkey";

-- AlterTable
ALTER TABLE "ResourceAttributePermission" DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ResourcePermission" DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("role");

-- AlterTable
ALTER TABLE "UserRoleMap" DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "FK_ROLE_MAP_ROLE_ID_idx" ON "UserRoleMap"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleMap_userId_roleId_key" ON "UserRoleMap"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "ResourcePermission" ADD CONSTRAINT "ResourcePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributePermission" ADD CONSTRAINT "ResourceAttributePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;
