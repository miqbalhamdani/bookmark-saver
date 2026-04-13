"use client";

import { useState, useTransition } from "react";
import { addBookmark, deleteBookmark } from "@/app/actions";
import type { Bookmark } from "@/drizzle/schema";

function getFaviconUrl(rawUrl: string): string | null {
  try {
    const { hostname } = new URL(rawUrl);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

export default function BookmarksClient({
  initialBookmarks,
}: {
  initialBookmarks: Bookmark[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!title.trim() || !url.trim()) return;
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    startTransition(async () => {
      await addBookmark(title.trim(), normalized);
      setTitle("");
      setUrl("");
      setIsModalOpen(false);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteBookmark(id);
    });
  }

  function handleCancel() {
    setTitle("");
    setUrl("");
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg shadow-gray-200/80 border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            My Bookmarks
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Add bookmark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>
        </div>

        {/* Bookmark List */}
        <ul className="divide-y divide-gray-50">
          {initialBookmarks.length === 0 && (
            <li className="px-6 py-12 text-center text-sm text-gray-400">
              No bookmarks yet. Click{" "}
              <span className="font-medium text-gray-500">+</span> to add one.
            </li>
          )}
          {initialBookmarks.map((bookmark) => {
            const favicon = getFaviconUrl(bookmark.url);
            return (
              <li
                key={bookmark.id}
                className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                {/* Favicon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {favicon ? (
                    <img
                      src={favicon}
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 1 1 2.828 2.828l-3 3a2 2 0 0 1-2.828 0 1 1 0 0 0-1.414 1.414 4 4 0 0 0 5.656 0l3-3a4 4 0 0 0-5.656-5.656l-1.5 1.5a1 1 0 1 0 1.414 1.414l1.5-1.5Zm-5 5a2 2 0 0 1 2.828 0 1 1 0 1 0 1.414-1.414 4 4 0 0 0-5.656 0l-3 3a4 4 1 0 0 5.656 5.656l1.5-1.5a1 1 0 1 0-1.414-1.414l-1.5 1.5a2 2 0 1 1-2.828-2.828l3-3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-gray-900 text-sm truncate hover:text-gray-600 transition-colors"
                  >
                    {bookmark.title}
                  </a>
                  <span className="block text-xs text-gray-400 truncate mt-0.5">
                    {bookmark.url}
                  </span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  disabled={isPending}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`Delete ${bookmark.title}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancel();
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-gray-900">
              Add Bookmark
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium text-gray-600"
                  htmlFor="bm-title"
                >
                  Title
                </label>
                <input
                  id="bm-title"
                  type="text"
                  placeholder="e.g. GitHub"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-300"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium text-gray-600"
                  htmlFor="bm-url"
                >
                  URL
                </label>
                <input
                  id="bm-url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                  className="w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !url.trim() || isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
