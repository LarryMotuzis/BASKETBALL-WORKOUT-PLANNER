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
  const description = formData.get("description") as string;

  if (!name || !category) {
    throw new Error("Name and category are required.");
  }

  await prisma.drill.create({
    data: { name, category, description, userId: session.user.id },
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
