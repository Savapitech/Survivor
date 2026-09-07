import 'dotenv/config';
import { DataSource } from 'typeorm';

const KEPT_QUESTION_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 23, 24, 28, 33, 74, 75, 79,
];

interface AttemptRow {
  id: number;
  seekerId: number;
  questionIds: number[];
}

interface AnswerRow {
  value: number;
  weight: number;
}

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
    const [{ count: totalSubmitted }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM attempt WHERE "submittedAt" IS NOT NULL`,
    );
    const [{ count: affectedBefore }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM attempt
       WHERE "submittedAt" IS NOT NULL AND NOT ("questionIds" <@ $1::int[])`,
      [KEPT_QUESTION_IDS],
    );
    const [{ count: certifiedBefore }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM seeker s
       JOIN attempt a ON a."seekerId" = s.id
       WHERE s.certification = true
         AND a."submittedAt" IS NOT NULL
         AND NOT (a."questionIds" <@ $1::int[])`,
      [KEPT_QUESTION_IDS],
    );

    console.log(`Submitted attempts total: ${totalSubmitted}`);
    console.log(
      `Attempts referencing a removed question (to recalculate): ${affectedBefore}`,
    );
    console.log(
      `Certified seekers among those attempts (before): ${certifiedBefore}`,
    );

    const affected: AttemptRow[] = await dataSource.query(
      `SELECT id, "seekerId", "questionIds" FROM attempt
       WHERE "submittedAt" IS NOT NULL AND NOT ("questionIds" <@ $1::int[])`,
      [KEPT_QUESTION_IDS],
    );

    let recalculated = 0;
    let nowCertified = 0;
    let nowUncertified = 0;

    for (const attempt of affected) {
      const keptIdsInAttempt = attempt.questionIds.filter((id) =>
        KEPT_QUESTION_IDS.includes(id),
      );
      const rows: AnswerRow[] = await dataSource.query(
        `SELECT ans.value AS value, q.weight AS weight
         FROM answer ans
         JOIN question q ON q.id = ans."questionId"
         WHERE ans."attemptId" = $1 AND ans."questionId" = ANY($2::int[])`,
        [attempt.id, keptIdsInAttempt],
      );

      const maxScore = 5 * rows.reduce((sum, r) => sum + Number(r.weight), 0);
      const rawScore = rows.reduce(
        (sum, r) => sum + Number(r.value) * Number(r.weight),
        0,
      );
      const score =
        maxScore > 0 ? Math.round((rawScore / maxScore) * 10000) / 100 : 0;
      const certified = score >= 60;

      await dataSource.query(
        `UPDATE attempt SET "questionIds" = $1, score = $2 WHERE id = $3`,
        [keptIdsInAttempt, score, attempt.id],
      );
      await dataSource.query(
        `UPDATE seeker SET certification = $1 WHERE id = $2`,
        [certified, attempt.seekerId],
      );

      recalculated += 1;
      if (certified) nowCertified += 1;
      else nowUncertified += 1;
    }

    console.log(
      `Attempts recalculated on the 20 remaining questions: ${recalculated}`,
    );
    console.log(`Now certified: ${nowCertified}`);
    console.log(`Now not certified: ${nowUncertified}`);

    const [{ count: affectedAfter }] = await dataSource.query(
      `SELECT COUNT(*)::int AS count FROM attempt
       WHERE "submittedAt" IS NOT NULL AND NOT ("questionIds" <@ $1::int[])`,
      [KEPT_QUESTION_IDS],
    );
    console.log(
      `Attempts still referencing a removed question (should be 0): ${affectedAfter}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Certification recalculation failed:', err);
  process.exit(1);
});
