"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPlayer(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const position = formData.get("position") as string;

  if (!firstName || !lastName) {
    throw new Error("First and last name are required.");
  }

  await prisma.player.create({
    data: { firstName, lastName, position },
  });

  revalidatePath("/players");
}

export async function deletePlayer(id: string) {
  await prisma.$transaction([
    prisma.workoutPlayer.deleteMany({ where: { playerId: id } }),
    prisma.player.delete({ where: { id } }),
  ]);

  revalidatePath("/players");
}
