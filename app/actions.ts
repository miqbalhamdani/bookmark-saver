"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { bookmarks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getBookmarks() {
  return db.select().from(bookmarks).orderBy(bookmarks.id);
}

export async function addBookmark(title: string, url: string) {
  await db.insert(bookmarks).values({ title, url });
  revalidatePath("/");
}

export async function deleteBookmark(id: number) {
  await db.delete(bookmarks).where(eq(bookmarks.id, id));
  revalidatePath("/");
}
