import { getBookmarks } from "@/app/actions";
import BookmarksClient from "@/app/bookmarks-client";

export default async function Home() {
  const bookmarks = await getBookmarks();
  return <BookmarksClient initialBookmarks={bookmarks} />;
}
