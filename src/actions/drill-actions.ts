"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createDrill(formData: FormData) {
  const userId = await getUserId();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  if (!name || !category) {
    throw new Error("Name and category are required.");
  }

  await prisma.drill.create({
    data: { name, category, description, userId },
  });

  revalidatePath("/drills");
}

export async function deleteDrill(id: string) {
  const userId = await getUserId();

  const drill = await prisma.drill.findFirst({ where: { id, userId } });
  if (!drill) throw new Error("Not found");

  await prisma.$transaction([
    prisma.workoutDrill.deleteMany({ where: { drillId: id } }),
    prisma.drill.delete({ where: { id } }),
  ]);

  revalidatePath("/drills");
}
