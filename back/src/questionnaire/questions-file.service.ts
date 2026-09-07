import { join } from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { loadQuestionsFile } from './questions-file.loader';
import { QuestionFileEntry, QuestionsFile } from './questions-file.types';

@Injectable()
export class QuestionsFileService implements OnModuleInit {
  private file: QuestionsFile | null = null;

  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async onModuleInit(): Promise<void> {
    const filePath =
      process.env.QUESTIONS_FILE_PATH ??
      join(process.cwd(), 'certification', 'questions.v2.json');
    this.file = loadQuestionsFile(filePath);
    await this.syncToDatabase(this.file.questions);
  }

  getVersion(): string {
    if (!this.file) {
      throw new Error('Questions file has not been loaded yet');
    }
    return this.file.version;
  }

  getQuestions(): QuestionFileEntry[] {
    if (!this.file) {
      throw new Error('Questions file has not been loaded yet');
    }
    return this.file.questions;
  }

  private async syncToDatabase(questions: QuestionFileEntry[]): Promise<void> {
    for (const question of questions) {
      const existing = await this.questionsRepository.findOneBy({ id: question.id });
      if (existing) {
        existing.label = question.label;
        existing.weight = question.weight;
        existing.active = question.active;
        await this.questionsRepository.save(existing);
      } else {
        await this.questionsRepository.save(
          this.questionsRepository.create({
            id: question.id,
            label: question.label,
            weight: question.weight,
            active: question.active,
          }),
        );
      }
    }

    const fileIds = questions.map((question) => question.id);
    const dbQuestions = await this.questionsRepository.find();
    const orphaned = dbQuestions.filter(
      (question) => !fileIds.includes(question.id) && question.active,
    );
    if (orphaned.length > 0) {
      await this.questionsRepository.update(
        { id: In(orphaned.map((question) => question.id)) },
        { active: false },
      );
    }
  }
}
