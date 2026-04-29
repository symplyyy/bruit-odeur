-- CreateEnum
CREATE TYPE "TopStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "SortieCategory" AS ENUM ('SON', 'ALBUM', 'CLIP', 'SPORT', 'AUTRE');

-- CreateEnum
CREATE TYPE "HotTakeStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "HotTakeSide" AS ENUM ('FIRE', 'FROID');

-- CreateTable
CREATE TABLE "Pseudo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pseudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Top" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TopStatus" NOT NULL DEFAULT 'DRAFT',
    "openAt" TIMESTAMP(3) NOT NULL,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Top_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sortie" (
    "id" TEXT NOT NULL,
    "topId" TEXT NOT NULL,
    "artiste" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "pochetteUrl" TEXT NOT NULL,
    "embedUrl" TEXT,
    "category" "SortieCategory" NOT NULL DEFAULT 'SON',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Sortie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopVote" (
    "id" TEXT NOT NULL,
    "topId" TEXT NOT NULL,
    "sortieId" TEXT NOT NULL,
    "pseudoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotTake" (
    "id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "backgroundUrl" TEXT,
    "status" "HotTakeStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3) NOT NULL,
    "closeAt" TIMESTAMP(3),
    "optionALabel" TEXT,
    "optionBLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotTake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotTakeVote" (
    "id" TEXT NOT NULL,
    "hotTakeId" TEXT NOT NULL,
    "pseudoId" TEXT NOT NULL,
    "side" "HotTakeSide" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HotTakeVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "thumbUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pseudo_name_key" ON "Pseudo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pseudo_slug_key" ON "Pseudo"("slug");

-- CreateIndex
CREATE INDEX "Pseudo_createdAt_idx" ON "Pseudo"("createdAt");

-- CreateIndex
CREATE INDEX "Top_status_idx" ON "Top"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Top_year_weekNumber_key" ON "Top"("year", "weekNumber");

-- CreateIndex
CREATE INDEX "Sortie_topId_idx" ON "Sortie"("topId");

-- CreateIndex
CREATE INDEX "TopVote_sortieId_idx" ON "TopVote"("sortieId");

-- CreateIndex
CREATE UNIQUE INDEX "TopVote_topId_pseudoId_key" ON "TopVote"("topId", "pseudoId");

-- CreateIndex
CREATE INDEX "HotTake_status_publishAt_idx" ON "HotTake"("status", "publishAt");

-- CreateIndex
CREATE INDEX "HotTakeVote_side_idx" ON "HotTakeVote"("side");

-- CreateIndex
CREATE UNIQUE INDEX "HotTakeVote_hotTakeId_pseudoId_key" ON "HotTakeVote"("hotTakeId", "pseudoId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "Sortie" ADD CONSTRAINT "Sortie_topId_fkey" FOREIGN KEY ("topId") REFERENCES "Top"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopVote" ADD CONSTRAINT "TopVote_topId_fkey" FOREIGN KEY ("topId") REFERENCES "Top"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopVote" ADD CONSTRAINT "TopVote_sortieId_fkey" FOREIGN KEY ("sortieId") REFERENCES "Sortie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopVote" ADD CONSTRAINT "TopVote_pseudoId_fkey" FOREIGN KEY ("pseudoId") REFERENCES "Pseudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotTakeVote" ADD CONSTRAINT "HotTakeVote_hotTakeId_fkey" FOREIGN KEY ("hotTakeId") REFERENCES "HotTake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotTakeVote" ADD CONSTRAINT "HotTakeVote_pseudoId_fkey" FOREIGN KEY ("pseudoId") REFERENCES "Pseudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
