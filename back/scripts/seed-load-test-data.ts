import fs from 'fs';
import path from 'path';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const TOTAL_SEEKERS = Number(process.env.SEED_TOTAL ?? 500);
const WITH_VIDEO = Number(process.env.SEED_WITH_VIDEO ?? 300);
const CONCURRENCY = Number(process.env.SEED_CONCURRENCY ?? 8);
const VIDEO_FIXTURE = path.join(__dirname, 'fixtures', 'sample.mp4');

interface IdRow {
  id: number;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init?.method ?? 'GET'} ${url} -> ${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

async function fetchIds(resource: string): Promise<number[]> {
  const body = await fetchJson<{ data: IdRow[] }>(
    `${API_URL}/${resource}?pageSize=100`,
  );
  return body.data.map((row) => row.id);
}

function pickSome<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

async function createOneSeeker(
  index: number,
  withVideo: boolean,
  competenceIds: number[],
  localisationIds: number[],
  activitySectorIds: number[],
  videoBuffer: Buffer,
): Promise<void> {
  const email = `loadtest${index}@competences-plus.fr`;
  const password = 'LoadTest1234!';

  await fetchJson(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      role: 'seeker',
      birthDate: '1995-06-15',
    }),
  });

  const login = await fetchJson<{
    access_token: string;
    user: { id: string };
  }>(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const token = login.access_token;
  const authHeaders = { Authorization: `Bearer ${token}` };
  const userId = login.user.id;

  const seeker = await fetchJson<{ id: number }>(`${API_URL}/seekers`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Test${index}`,
      lastname: `LoadTest${index}`,
      userId,
      competenceIds: pickSome(competenceIds, 1 + (index % 3)),
      localisationIds: pickSome(localisationIds, 1),
      activitySectorIds: pickSome(activitySectorIds, 1 + (index % 2)),
    }),
  });

  if (withVideo) {
    const form = new FormData();
    form.append(
      'file',
      new Blob([new Uint8Array(videoBuffer)], { type: 'video/mp4' }),
      'sample.mp4',
    );
    form.append('videoConsent', 'true');
    const res = await fetch(`${API_URL}/seekers/${seeker.id}/video`, {
      method: 'POST',
      headers: authHeaders,
      body: form,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `POST /seekers/${seeker.id}/video -> ${res.status} ${body}`,
      );
    }
  }
}

async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, i: number) => Promise<void>,
): Promise<{ ok: number; failed: number }> {
  let ok = 0;
  let failed = 0;
  let cursor = 0;
  async function runNext(): Promise<void> {
    while (cursor < items.length) {
      const i = cursor;
      cursor += 1;
      try {
        await worker(items[i], i);
        ok += 1;
        if (ok % 25 === 0) console.log(`  ${ok}/${items.length} ok...`);
      } catch (err) {
        failed += 1;
        console.error(`  #${i} failed: ${(err as Error).message}`);
      }
    }
  }
  await Promise.all(
    Array.from({ length: concurrency }, () => runNext()),
  );
  return { ok, failed };
}

async function main() {
  console.log(`Seeding ${TOTAL_SEEKERS} seekers`);
  const [competenceIds, localisationIds, activitySectorIds] =
    await Promise.all([
      fetchIds('competences'),
      fetchIds('localisations'),
      fetchIds('activity-sectors'),
    ]);
  const videoBuffer = fs.readFileSync(VIDEO_FIXTURE);

  const indices = Array.from({ length: TOTAL_SEEKERS }, (_, i) => i + 1);
  const videoIndices = new Set(pickSome(indices, WITH_VIDEO));

  const { ok, failed } = await runPool(indices, CONCURRENCY, (index) =>
    createOneSeeker(
      index,
      videoIndices.has(index),
      competenceIds,
      localisationIds,
      activitySectorIds,
      videoBuffer,
    ),
  );

  console.log(`Done. ok=${ok} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
