"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export interface TestimonialData {
  name:      string;
  role:      string;
  image?:    string;
  message:   string;
  order?:    number;
  published?: boolean;
}

// ─── Public: fetch all published testimonials (sorted) ───────────────────────
export async function getPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where:   { published: true },
    orderBy: { order: "asc" },
  });
}

// ─── Admin: fetch all testimonials ───────────────────────────────────────────
export async function getAllTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });
}

// ─── Admin: create ────────────────────────────────────────────────────────────
export async function createTestimonial(data: TestimonialData) {
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name:      data.name,
        role:      data.role,
        image:     data.image ?? "/profile.png",
        message:   data.message,
        order:     data.order ?? 0,
        published: data.published ?? true,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, testimonial };
  } catch (err) {
    console.error("[createTestimonial]", err);
    return { success: false, error: "Failed to create testimonial." };
  }
}

// ─── Admin: update ────────────────────────────────────────────────────────────
export async function updateTestimonial(id: string, data: Partial<TestimonialData>) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, testimonial };
  } catch (err) {
    console.error("[updateTestimonial]", err);
    return { success: false, error: "Failed to update testimonial." };
  }
}

// ─── Admin: delete ────────────────────────────────────────────────────────────
export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (err) {
    console.error("[deleteTestimonial]", err);
    return { success: false, error: "Failed to delete testimonial." };
  }
}

// ─── Admin: bulk reorder ─────────────────────────────────────────────────────
export async function reorderTestimonials(ids: string[]) {
  try {
    await Promise.all(
      ids.map((id, index) =>
        prisma.testimonial.update({ where: { id }, data: { order: index } })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (err) {
    console.error("[reorderTestimonials]", err);
    return { success: false, error: "Failed to reorder testimonials." };
  }
}

// ─── Admin: toggle publish ───────────────────────────────────────────────────
export async function toggleTestimonialPublished(id: string, published: boolean) {
  return updateTestimonial(id, { published });
}