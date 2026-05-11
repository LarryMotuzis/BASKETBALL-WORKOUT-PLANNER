/*
  Warnings:

  - You are about to drop the column `playerId` on the `Workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_playerId_fkey";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "playerId";

-- CreateTable
CREATE TABLE "WorkoutPlayer" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutPlayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutPlayer" ADD CONSTRAINT "WorkoutPlayer_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlayer" ADD CONSTRAINT "WorkoutPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
