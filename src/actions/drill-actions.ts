"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDrill(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const personnel = (formData.get("personnel") as string) || null;
  const concept = (formData.get("concept") as string) || null;
  const description = formData.get("description") as string;

  if (!name || !category) {
    throw new Error("Name and category are required.");
  }

  await prisma.drill.create({
    data: { name, category, personnel, concept, description, userId: session.user.id },
  });

  revalidatePath("/drills");
}

export async function updateDrill(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as string;
  const personnel = (formData.get("personnel") as string) || null;
  const concept = (formData.get("concept") as string) || null;
  const description = (formData.get("description") as string)?.trim();

  if (!name || !category) throw new Error("Name and category are required.");

  await prisma.drill.update({
    where: { id, userId: session.user.id },
    data: { name, category, personnel, concept, description: description || null },
  });

  revalidatePath("/drills");
}

export async function deleteDrill(id: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  await prisma.$transaction([
    prisma.workoutDrill.deleteMany({ where: { drillId: id } }),
    prisma.drill.delete({ where: { id, userId: session.user.id } }),
  ]);

  revalidatePath("/drills");
}
