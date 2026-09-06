import 'dotenv/config';
import { DataSource } from 'typeorm';

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'profilsactifs',
  });
  await dataSource.initialize();

  try {
    const [{ count: before }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM seeker WHERE video IS NOT NULL AND "videoProvider" IS NULL`,
    );
    console.log(`Rows to migrate (video set, videoProvider still empty): ${before}`);

    const result = await dataSource.query(
      `UPDATE seeker
       SET "videoProvider" = 'link', "videoExternalId" = video
       WHERE video IS NOT NULL AND "videoProvider" IS NULL`,
    );
    const updated = result?.[1] ?? result?.affectedRows ?? 'unknown';
    console.log(`Rows updated: ${updated}`);

    const [{ count: after }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM seeker WHERE video IS NOT NULL AND "videoProvider" IS NULL`,
    );
    console.log(`Rows still needing migration (should be 0): ${after}`);

    const [{ count: total }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM seeker WHERE "videoProvider" IS NOT NULL`,
    );
    console.log(`Total seekers now on a video provider: ${total}`);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Video storage migration failed:', err);
  process.exit(1);
});
