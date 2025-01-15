-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "trainingTarget" TEXT NOT NULL DEFAULT 'default_value';

-- CreateTable
CREATE TABLE "ExerciseDetail" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "duration" INTEGER,

    CONSTRAINT "ExerciseDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExerciseDetail" ADD CONSTRAINT "ExerciseDetail_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
