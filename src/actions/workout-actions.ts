"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createWorkout(formData: FormData) {
  const userId = await getUserId();
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
      userId,
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

export async function deleteWorkout(id: string) {
  const userId = await getUserId();

  const workout = await prisma.workout.findFirst({ where: { id, userId } });
  if (!workout) throw new Error("Not found");

  await prisma.$transaction([
    prisma.workoutDrill.deleteMany({ where: { workoutId: id } }),
    prisma.workoutPlayer.deleteMany({ where: { workoutId: id } }),
    prisma.workout.delete({ where: { id } }),
  ]);

  revalidatePath("/workouts");
}
