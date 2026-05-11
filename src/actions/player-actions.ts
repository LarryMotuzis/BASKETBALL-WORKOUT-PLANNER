"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createPlayer(formData: FormData) {
  const userId = await getUserId();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const position = formData.get("position") as string;

  if (!firstName || !lastName) {
    throw new Error("First and last name are required.");
  }

  await prisma.player.create({
    data: { firstName, lastName, position, userId },
  });

  revalidatePath("/players");
}

export async function deletePlayer(id: string) {
  const userId = await getUserId();

  const player = await prisma.player.findFirst({ where: { id, userId } });
  if (!player) throw new Error("Not found");

  await prisma.$transaction([
    prisma.workoutPlayer.deleteMany({ where: { playerId: id } }),
    prisma.player.delete({ where: { id } }),
  ]);

  revalidatePath("/players");
}
