"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDrill(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  if (!name || !category) {
    throw new Error("Name and category are required.");
  }

  await prisma.drill.create({
    data: { name, category, description },
  });

  revalidatePath("/drills");
}

export async function deleteDrill(id: string) {
  await prisma.$transaction([
    prisma.workoutDrill.deleteMany({ where: { drillId: id } }),
    prisma.drill.delete({ where: { id } }),
  ]);

  revalidatePath("/drills");
}
