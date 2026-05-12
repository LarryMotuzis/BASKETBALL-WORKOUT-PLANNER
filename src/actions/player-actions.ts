"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPlayer(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const position = formData.get("position") as string;

  if (!firstName || !lastName) {
    throw new Error("First and last name are required.");
  }

  await prisma.player.create({
    data: { firstName, lastName, position, userId: session.user.id },
  });

  revalidatePath("/players");
}

export async function updatePlayer(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const position = (formData.get("position") as string)?.trim();

  if (!firstName || !lastName) throw new Error("First and last name are required.");

  await prisma.player.update({
    where: { id, userId: session.user.id },
    data: { firstName, lastName, position: position || null },
  });

  revalidatePath("/players");
  revalidatePath(`/players/${id}`);
}

export async function deletePlayer(id: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  await prisma.$transaction([
    prisma.workoutPlayer.deleteMany({ where: { playerId: id } }),
    prisma.player.delete({ where: { id, userId: session.user.id } }),
  ]);

  revalidatePath("/players");
}
