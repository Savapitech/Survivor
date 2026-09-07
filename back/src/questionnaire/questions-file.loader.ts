import { readFileSync } from 'fs';
import { QuestionFileEntry, QuestionsFile } from './questions-file.types';

export class QuestionsFileValidationError extends Error {}

function describeQuestion(entry: unknown, index: number): string {
  const id =
    entry && typeof entry === 'object' && 'id' in entry
      ? (entry as { id: unknown }).id
      : undefined;
  return id !== undefined
    ? `question id=${JSON.stringify(id)} (index ${index})`
    : `question at index ${index}`;
}

function validateQuestion(
  entry: unknown,
  index: number,
  errors: string[],
  seenIds: Set<number>,
) {
  if (typeof entry !== 'object' || entry === null) {
    errors.push(`${describeQuestion(entry, index)}: is not an object`);
    return;
  }
  const q = entry as Record<string, unknown>;
  const label = describeQuestion(entry, index);

  if (!Number.isInteger(q.id) || (q.id as number) <= 0) {
    errors.push(`${label}: id must be a positive integer`);
  } else if (seenIds.has(q.id as number)) {
    errors.push(`${label}: id is duplicated`);
  } else {
    seenIds.add(q.id as number);
  }

  if (typeof q.label !== 'string' || q.label.trim().length === 0) {
    errors.push(`${label}: label must be a non-empty string`);
  } else if (q.label.length > 300) {
    errors.push(`${label}: label must be 300 characters or fewer`);
  }

  if (q.type !== 'scale') {
    errors.push(`${label}: type must be "scale"`);
  }

  if (
    typeof q.options !== 'object' ||
    q.options === null ||
    typeof (q.options as Record<string, unknown>).min !== 'number' ||
    typeof (q.options as Record<string, unknown>).max !== 'number' ||
    (q.options as Record<string, number>).min >=
      (q.options as Record<string, number>).max
  ) {
    errors.push(`${label}: options must be an object with numeric min < max`);
  }

  if (typeof q.weight !== 'number' || q.weight < 0.1 || q.weight > 10) {
    errors.push(`${label}: weight must be a number between 0.1 and 10`);
  }

  if (typeof q.active !== 'boolean') {
    errors.push(`${label}: active must be a boolean`);
  }
}

export function loadQuestionsFile(filePath: string): QuestionsFile {
  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new QuestionsFileValidationError(
      `Cannot read questions file at ${filePath}: ${(err as Error).message}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new QuestionsFileValidationError(
      `Questions file at ${filePath} is not valid JSON: ${(err as Error).message}`,
    );
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new QuestionsFileValidationError(
      'Questions file must contain a JSON object',
    );
  }
  const file = parsed as Record<string, unknown>;

  if (typeof file.version !== 'string' || file.version.trim().length === 0) {
    throw new QuestionsFileValidationError(
      'Questions file: "version" must be a non-empty string',
    );
  }
  if (!Array.isArray(file.questions) || file.questions.length === 0) {
    throw new QuestionsFileValidationError(
      'Questions file: "questions" must be a non-empty array',
    );
  }

  const errors: string[] = [];
  const seenIds = new Set<number>();
  file.questions.forEach((entry, index) =>
    validateQuestion(entry, index, errors, seenIds),
  );

  if (errors.length > 0) {
    throw new QuestionsFileValidationError(
      `Questions file at ${filePath} is invalid:\n${errors.map((e) => `- ${e}`).join('\n')}`,
    );
  }

  return {
    version: file.version,
    questions: file.questions as QuestionFileEntry[],
  };
}
