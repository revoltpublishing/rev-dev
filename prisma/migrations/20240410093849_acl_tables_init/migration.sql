-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "des" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAttribute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourcePermission" (
    "id" SERIAL NOT NULL,
    "roleId" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "action" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourcePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAttributePermission" (
    "id" SERIAL NOT NULL,
    "roleId" TEXT NOT NULL,
    "resourceAttributeId" INTEGER NOT NULL,
    "action" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceAttributePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleMap" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoleMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_key" ON "Resource"("name");

-- CreateIndex
CREATE INDEX "FK_RA_RESOURCE_ID_idx" ON "ResourceAttribute"("resourceId");

-- CreateIndex
CREATE INDEX "FK_RP_RESOURCE_ID_idx" ON "ResourcePermission"("resourceId");

-- CreateIndex
CREATE INDEX "FK_RAP_RESOURCE_ATTRIBUTE_ID_idx" ON "ResourceAttributePermission"("resourceAttributeId");

-- CreateIndex
CREATE INDEX "FK_ROLE_MAP_ROLE_ID_idx" ON "UserRoleMap"("roleId");

-- CreateIndex
CREATE INDEX "FK_ROLE_MAP_USER_ID_idx" ON "UserRoleMap"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleMap_userId_roleId_key" ON "UserRoleMap"("userId", "roleId");

-- CreateIndex
CREATE INDEX "FK_BOOK_ID_STAGE_idx" ON "BookStage"("bookId");

-- CreateIndex
CREATE INDEX "FK_BOOK_USER_ID_idx" ON "BookUserMap"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ResourceAttribute" ADD CONSTRAINT "ResourceAttribute_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourcePermission" ADD CONSTRAINT "ResourcePermission_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourcePermission" ADD CONSTRAINT "ResourcePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributePermission" ADD CONSTRAINT "ResourceAttributePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAttributePermission" ADD CONSTRAINT "ResourceAttributePermission_resourceAttributeId_fkey" FOREIGN KEY ("resourceAttributeId") REFERENCES "ResourceAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
