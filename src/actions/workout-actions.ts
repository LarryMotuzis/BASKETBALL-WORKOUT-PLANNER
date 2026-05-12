"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWorkout(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const title = formData.get("title") as string;
  const focus = formData.get("focus") as string;
  const workoutDate = formData.get("workoutDate") as string;
  const notes = formData.get("notes") as string;

  const playerIds = formData.getAll("playerIds") as string[];
  const drillsDataRaw = formData.get("drillsData") as string;
  const drillsData: { id: string; order: number; duration: number | null; sets: number | null }[] =
    drillsDataRaw ? JSON.parse(drillsDataRaw) : [];

  if (!title || !focus || !workoutDate || playerIds.length === 0) {
    throw new Error("Title, focus, date, and at least one player are required.");
  }

  await prisma.workout.create({
    data: {
      title,
      focus,
      workoutDate: new Date(workoutDate),
      notes,
      userId: session.user.id,
      workoutPlayers: {
        create: playerIds.map((playerId) => ({ playerId })),
      },
      workoutDrills: {
        create: drillsData.map((d) => ({
          drillId: d.id,
          order: d.order,
          duration: d.duration,
          sets: d.sets,
        })),
      },
    },
  });

  revalidatePath("/workouts");
}

export async function updateWorkout(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const title = formData.get("title") as string;
  const focus = formData.get("focus") as string;
  const workoutDate = formData.get("workoutDate") as string;
  const notes = formData.get("notes") as string;
  const playerIds = formData.getAll("playerIds") as string[];
  const drillsDataRaw = formData.get("drillsData") as string;
  const drillsData: { id: string; order: number; duration: number | null; sets: number | null }[] =
    drillsDataRaw ? JSON.parse(drillsDataRaw) : [];

  if (!title || !focus || !workoutDate || playerIds.length === 0) {
    throw new Error("Title, focus, date, and at least one player are required.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.workoutPlayer.deleteMany({ where: { workoutId: id } });
    await tx.workoutDrill.deleteMany({ where: { workoutId: id } });
    await tx.workout.update({
      where: { id, userId: session.user.id },
      data: {
        title,
        focus,
        workoutDate: new Date(workoutDate),
        notes: notes || null,
        workoutPlayers: { create: playerIds.map((playerId) => ({ playerId })) },
        workoutDrills: {
          create: drillsData.map((d) => ({
            drillId: d.id,
            order: d.order,
            duration: d.duration,
            sets: d.sets,
          })),
        },
      },
    });
  });

  revalidatePath("/workouts");
  redirect("/workouts");
}

export async function deleteWorkout(id: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  await prisma.$transaction([
    prisma.workoutDrill.deleteMany({ where: { workoutId: id } }),
    prisma.workoutPlayer.deleteMany({ where: { workoutId: id } }),
    prisma.workout.delete({ where: { id, userId: session.user.id } }),
  ]);

  revalidatePath("/workouts");
}
