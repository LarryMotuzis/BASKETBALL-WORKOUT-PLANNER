"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorkout(formData: FormData) {
  const title = formData.get("title") as string;
  const focus = formData.get("focus") as string;
  const workoutDate = formData.get("workoutDate") as string;
  const notes = formData.get("notes") as string;

  const playerIds = formData.getAll("playerIds") as string[];
  const drillIds = formData.getAll("drillIds") as string[];

  if (!title || !focus || !workoutDate || playerIds.length === 0) {
    throw new Error("Title, focus, date, and at least one player are required.");
  }

  await prisma.workout.create({
    data: {
      title,
      focus,
      workoutDate: new Date(workoutDate),
      notes,
      workoutPlayers: {
        create: playerIds.map((playerId) => ({ playerId })),
      },
      workoutDrills: {
        create: drillIds.map((drillId, index) => ({
          drillId,
          order: index + 1,
        })),
      },
    },
  });

  revalidatePath("/workouts");
}

export async function deleteWorkout(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Workout ID is required.");

  await prisma.$transaction([
    prisma.workoutDrill.deleteMany({ where: { workoutId: id } }),
    prisma.workoutPlayer.deleteMany({ where: { workoutId: id } }),
    prisma.workout.delete({ where: { id } }),
  ]);

  revalidatePath("/workouts");
}
