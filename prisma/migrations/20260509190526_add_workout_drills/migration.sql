-- CreateTable
CREATE TABLE "WorkoutDrill" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "drillId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutDrill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutDrill" ADD CONSTRAINT "WorkoutDrill_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutDrill" ADD CONSTRAINT "WorkoutDrill_drillId_fkey" FOREIGN KEY ("drillId") REFERENCES "Drill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
