/*
  Warnings:

  - You are about to drop the `_MemberToTrainer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MemberToTrainer" DROP CONSTRAINT "_MemberToTrainer_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemberToTrainer" DROP CONSTRAINT "_MemberToTrainer_B_fkey";

-- DropTable
DROP TABLE "_MemberToTrainer";

-- CreateTable
CREATE TABLE "TrainerMember" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "ptStartDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainerMember_memberId_trainerId_key" ON "TrainerMember"("memberId", "trainerId");

-- AddForeignKey
ALTER TABLE "TrainerMember" ADD CONSTRAINT "TrainerMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerMember" ADD CONSTRAINT "TrainerMember_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
