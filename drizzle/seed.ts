import { config } from "dotenv";
config({ path: ".env" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { bookmarks } from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

const seeds = [
  { title: "GitHub", url: "https://github.com" },
  { title: "Vercel", url: "https://vercel.com" },
  { title: "Tailwind CSS", url: "https://tailwindcss.com" },
  { title: "Next.js Docs", url: "https://nextjs.org/docs" },
  { title: "Supabase", url: "https://supabase.com" },
  { title: "Drizzle ORM", url: "https://orm.drizzle.team" },
];

async function seed() {
  console.log("Seeding bookmarks...");
  await db.insert(bookmarks).values(seeds);
  console.log(`✓ Inserted ${seeds.length} bookmarks`);
  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
