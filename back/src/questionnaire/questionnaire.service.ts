import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Attempt } from './entities/attempt.entity';
import { Answer } from './entities/answer.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindQuestionsQueryDto } from './dto/find-questions-query.dto';
import { SaveAnswersDto } from './dto/save-answers.dto';
import { Seeker } from '../seekers/entities/seeker.entity';
import { paginate, toSkipTake } from '../common/pagination';

const PASS_THRESHOLD = 60;
const ANSWER_MAX_VALUE = 5;
const UNIQUE_VIOLATION = '23505';

export interface AttemptView {
  id: number;
  score: number | null;
  submittedAt: Date | null;
  questions: Question[];
  answers: Answer[];
}

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(Attempt)
    private readonly attemptsRepository: Repository<Attempt>,
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    @InjectRepository(Seeker)
    private readonly seekersRepository: Repository<Seeker>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createQuestion(dto: CreateQuestionDto) {
    return this.questionsRepository.save(this.questionsRepository.create(dto));
  }

  async findQuestions(query: FindQuestionsQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.questionsRepository.findAndCount({
      where: query.includeInactive ? {} : { active: true },
      skip,
      take,
      order: { id: 'ASC' },
    });
    return paginate(items, total, query);
  }

  async findQuestion(id: number) {
    const question = await this.questionsRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async updateQuestion(id: number, dto: UpdateQuestionDto) {
    await this.findQuestion(id);
    const hasAnswers = await this.answersRepository.existsBy({
      question: { id },
    });
    if (hasAnswers) {
      throw new ConflictException(
        'Question already answered; deactivate it and create a new one',
      );
    }
    await this.questionsRepository.update(id, dto);
    return this.findQuestion(id);
  }

  async deactivateQuestion(id: number) {
    const question = await this.findQuestion(id);
    question.active = false;
    return this.questionsRepository.save(question);
  }

  private async buildAttemptView(attempt: Attempt): Promise<AttemptView> {
    const questions = attempt.questionIds.length
      ? await this.questionsRepository.findBy({ id: In(attempt.questionIds) })
      : [];
    const orderedQuestions = attempt.questionIds
      .map((id) => questions.find((question) => question.id === id))
      .filter((question): question is Question => question !== undefined);

    const answers = await this.answersRepository.find({
      where: { attempt: { id: attempt.id } },
      relations: { question: true },
    });

    return {
      id: attempt.id,
      score: attempt.score,
      submittedAt: attempt.submittedAt,
      questions: orderedQuestions,
      answers,
    };
  }

  async getOrCreateCurrentAttempt(seekerId: number) {
    const seeker = await this.seekersRepository.findOneBy({ id: seekerId });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    let attempt = await this.attemptsRepository.findOne({
      where: { seeker: { id: seekerId } },
    });

    if (attempt && !attempt.submittedAt) {
      await this.attemptsRepository.delete(attempt.id);
      attempt = null;
    }

    if (!attempt) {
      const activeQuestions = await this.questionsRepository.find({
        where: { active: true },
        order: { id: 'ASC' },
      });
      const draft = this.attemptsRepository.create({
        seeker,
        questionIds: activeQuestions.map((question) => question.id),
        score: null,
        submittedAt: null,
      });
      try {
        attempt = await this.attemptsRepository.save(draft);
      } catch (err) {
        const isUniqueViolation =
          err instanceof QueryFailedError &&
          (err as unknown as { code?: string }).code === UNIQUE_VIOLATION;
        if (!isUniqueViolation) {
          throw err;
        }
        attempt = await this.attemptsRepository.findOneBy({
          seeker: { id: seekerId },
        });
        if (!attempt) {
          throw err;
        }
      }
    }

    return this.buildAttemptView(attempt);
  }

  async findAttempt(id: number) {
    const attempt = await this.attemptsRepository.findOneBy({ id });
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    return this.buildAttemptView(attempt);
  }

  async saveAnswers(attemptId: number, dto: SaveAnswersDto) {
    const attempt = await this.attemptsRepository.findOneBy({ id: attemptId });
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.submittedAt) {
      throw new ConflictException('This attempt has already been submitted');
    }

    const invalidIds = dto.answers
      .map((answer) => answer.questionId)
      .filter((id) => !attempt.questionIds.includes(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Question id(s) not part of this attempt: ${invalidIds.join(', ')}`,
      );
    }

    const existingAnswers = await this.answersRepository.find({
      where: { attempt: { id: attemptId } },
      relations: { question: true },
    });

    const merged = dto.answers.map((input) => {
      const existing = existingAnswers.find(
        (answer) => answer.question.id === input.questionId,
      );
      if (existing) {
        existing.value = input.value;
        return existing;
      }
      return this.answersRepository.create({
        attempt,
        question: { id: input.questionId },
        value: input.value,
      });
    });

    await this.answersRepository.save(merged);
    return this.buildAttemptView(attempt);
  }

  async submitAttempt(attemptId: number) {
    const attempt = await this.attemptsRepository.findOne({
      where: { id: attemptId },
      relations: { seeker: true },
    });
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.submittedAt) {
      throw new ConflictException('This attempt has already been submitted');
    }

    const questions = attempt.questionIds.length
      ? await this.questionsRepository.findBy({ id: In(attempt.questionIds) })
      : [];
    const answers = await this.answersRepository.find({
      where: { attempt: { id: attemptId } },
      relations: { question: true },
    });

    const maxScore =
      ANSWER_MAX_VALUE *
      questions.reduce((sum, question) => sum + question.weight, 0);
    const rawScore = answers.reduce(
      (sum, answer) => sum + answer.value * answer.question.weight,
      0,
    );
    const score =
      maxScore > 0 ? Math.round((rawScore / maxScore) * 10000) / 100 : 0;
    const certified = score >= PASS_THRESHOLD;
    const submittedAt = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Attempt, attempt.id, { score, submittedAt });
      await manager.update(Seeker, attempt.seeker.id, {
        certification: certified,
      });
    });

    return { attemptId: attempt.id, score, submittedAt, certified };
  }
}
