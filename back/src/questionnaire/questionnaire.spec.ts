import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireService } from './questionnaire.service';

import { FindQuestionsQueryDto } from './dto/find-questions-query.dto';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SaveAnswersDto } from './dto/save-answers.dto';

describe('QuestionnaireController', () => {
  let controller: QuestionnaireController;

  const questionnaireServiceMock = {
    findQuestions: jest.fn(),
    findQuestion: jest.fn(),
    getOrCreateCurrentAttempt: jest.fn(),
    findAttempt: jest.fn(),
    saveAnswers: jest.fn(),
    submitAttempt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionnaireController],
      providers: [
        {
          provide: QuestionnaireService,
          useValue: questionnaireServiceMock,
        },
      ],
    }).compile();

    controller = module.get<QuestionnaireController>(
      QuestionnaireController,
    );

    jest.clearAllMocks();
  });

  describe('findQuestions', () => {
    it('should return all questions', async () => {
      const query = {
        page: 1,
        pageSize: 20,
      } as FindQuestionsQueryDto;

      const expectedResult = {
        data: [
          {
            id: 1,
            question: 'Quelle est votre expérience professionnelle ?',
          },
          {
            id: 2,
            question: 'Quelles sont vos compétences ?',
          },
        ],
        total: 2,
        page: 1,
        pageSize: 20,
      };

      questionnaireServiceMock.findQuestions.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findQuestions(query);

      expect(result).toEqual(expectedResult);

      expect(
        questionnaireServiceMock.findQuestions,
      ).toHaveBeenCalledTimes(1);

      expect(
        questionnaireServiceMock.findQuestions,
      ).toHaveBeenCalledWith(query);
    });

    it('should pass the query unchanged to the service', async () => {
      const query = {
        page: 2,
        pageSize: 10,
      } as FindQuestionsQueryDto;

      questionnaireServiceMock.findQuestions.mockResolvedValue([]);

      await controller.findQuestions(query);

      expect(
        questionnaireServiceMock.findQuestions,
      ).toHaveBeenCalledWith(query);
    });
  });

  describe('findQuestion', () => {
    it('should return a question by id', async () => {
      const id = 1;

      const expectedResult = {
        id,
        question: 'Quelle est votre expérience professionnelle ?',
      };

      questionnaireServiceMock.findQuestion.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findQuestion(id);

      expect(result).toEqual(expectedResult);

      expect(
        questionnaireServiceMock.findQuestion,
      ).toHaveBeenCalledTimes(1);

      expect(
        questionnaireServiceMock.findQuestion,
      ).toHaveBeenCalledWith(id);
    });

    it('should pass the id unchanged to the service', async () => {
      const id = 42;

      questionnaireServiceMock.findQuestion.mockResolvedValue({
        id,
        question: 'Question test',
      });

      await controller.findQuestion(id);

      expect(
        questionnaireServiceMock.findQuestion,
      ).toHaveBeenCalledWith(id);
    });
  });

  describe('getOrCreateCurrentAttempt', () => {
    it('should get or create the current attempt', async () => {
      const seekerId = 1;

      const query = {
        seekerId,
      } as AttemptQueryDto;

      const expectedResult = {
        id: 1,
        seekerId,
        status: 'IN_PROGRESS',
      };

      questionnaireServiceMock.getOrCreateCurrentAttempt.mockResolvedValue(
        expectedResult,
      );

      const result =
        await controller.getOrCreateCurrentAttempt(query);

      expect(result).toEqual(expectedResult);

      expect(
        questionnaireServiceMock.getOrCreateCurrentAttempt,
      ).toHaveBeenCalledTimes(1);

      expect(
        questionnaireServiceMock.getOrCreateCurrentAttempt,
      ).toHaveBeenCalledWith(seekerId);
    });

    it('should only pass seekerId to the service', async () => {
      const query = {
        seekerId: 1,
      } as AttemptQueryDto;

      questionnaireServiceMock.getOrCreateCurrentAttempt.mockResolvedValue(
        {
          id: 2,
        },
      );

      await controller.getOrCreateCurrentAttempt(query);

      expect(
        questionnaireServiceMock.getOrCreateCurrentAttempt,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('findAttempt', () => {
    it('should return an attempt by id', async () => {
      const id = 1;

      const expectedResult = {
        id,
        status: 'IN_PROGRESS',
      };

      questionnaireServiceMock.findAttempt.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAttempt(id);

      expect(result).toEqual(expectedResult);

      expect(
        questionnaireServiceMock.findAttempt,
      ).toHaveBeenCalledTimes(1);

      expect(
        questionnaireServiceMock.findAttempt,
      ).toHaveBeenCalledWith(id);
    });

    it('should pass the id unchanged to the service', async () => {
      const id = 42;

      questionnaireServiceMock.findAttempt.mockResolvedValue({
        id,
        status: 'COMPLETED',
      });

      await controller.findAttempt(id);

      expect(
        questionnaireServiceMock.findAttempt,
      ).toHaveBeenCalledWith(id);
    });
  });

  describe('saveAnswers', () => {
    it('should save answers for an attempt', async () => {
      const id = 1;

      const dto = {
        answers: [
          {
            questionId: 1,
            value: 1,
          },
          {
            questionId: 2,
            value: 1,
          },
        ],
      } as SaveAnswersDto;

      const expectedResult = {
        id,
        status: 'IN_PROGRESS',
        answers: dto.answers,
      };

      questionnaireServiceMock.saveAnswers.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.saveAnswers(id, dto);

      expect(result).toEqual(expectedResult);

      expect(
        questionnaireServiceMock.saveAnswers,
      ).toHaveBeenCalledTimes(1);

      expect(
        questionnaireServiceMock.saveAnswers,
      ).toHaveBeenCalledWith(id, dto);
    });

    it('should pass both id and dto to the service', async () => {
      const id = 5;

      const dto = {
        answers: [],
      } as SaveAnswersDto;

      questionnaireServiceMock.saveAnswers.mockResolvedValue({
        id,
        answers: [],
      });

      await controller.saveAnswers(id, dto);

      expect(
        questionnaireServiceMock.saveAnswers,
      ).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('submitAttempt', () => {
    it('should submit an attempt', async () => {
      const id = 1;

      const expectedResult = {
        id,
        status: 'SUBMITTED',
      };

      questionnaireServiceMock.submitAttempt.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.submitAttempt(id);

      expect(result).toEqual(expectedResult);

      expect(
        questionnaireServiceMock.submitAttempt,
      ).toHaveBeenCalledTimes(1);

      expect(
        questionnaireServiceMock.submitAttempt,
      ).toHaveBeenCalledWith(id);
    });

    it('should pass the id unchanged to the service', async () => {
      const id = 42;

      questionnaireServiceMock.submitAttempt.mockResolvedValue({
        id,
        status: 'SUBMITTED',
      });

      await controller.submitAttempt(id);

      expect(
        questionnaireServiceMock.submitAttempt,
      ).toHaveBeenCalledWith(id);
    });
  });

  describe('service errors', () => {
    it('should propagate findQuestions errors', async () => {
      const query = {} as FindQuestionsQueryDto;
      const error = new Error('Find questions failed');

      questionnaireServiceMock.findQuestions.mockRejectedValue(error);

      await expect(
        controller.findQuestions(query),
      ).rejects.toThrow(error);

      expect(
        questionnaireServiceMock.findQuestions,
      ).toHaveBeenCalledWith(query);
    });

    it('should propagate findQuestion errors', async () => {
      const error = new Error('Question not found');

      questionnaireServiceMock.findQuestion.mockRejectedValue(error);

      await expect(
        controller.findQuestion(999),
      ).rejects.toThrow(error);

      expect(
        questionnaireServiceMock.findQuestion,
      ).toHaveBeenCalledWith(999);
    });

    it('should propagate getOrCreateCurrentAttempt errors', async () => {
      const query = {
        seekerId: 3,
      } as AttemptQueryDto;

      const error = new Error('Unable to get current attempt');

      questionnaireServiceMock.getOrCreateCurrentAttempt.mockRejectedValue(
        error,
      );

      await expect(
        controller.getOrCreateCurrentAttempt(query),
      ).rejects.toThrow(error);

      expect(
        questionnaireServiceMock.getOrCreateCurrentAttempt,
      ).toHaveBeenCalledWith(query.seekerId);
    });

    it('should propagate findAttempt errors', async () => {
      const error = new Error('Attempt not found');

      questionnaireServiceMock.findAttempt.mockRejectedValue(error);

      await expect(
        controller.findAttempt(999),
      ).rejects.toThrow(error);

      expect(
        questionnaireServiceMock.findAttempt,
      ).toHaveBeenCalledWith(999);
    });

    it('should propagate saveAnswers errors', async () => {
      const dto = {
        answers: [],
      } as SaveAnswersDto;

      const error = new Error('Unable to save answers');

      questionnaireServiceMock.saveAnswers.mockRejectedValue(error);

      await expect(
        controller.saveAnswers(1, dto),
      ).rejects.toThrow(error);

      expect(
        questionnaireServiceMock.saveAnswers,
      ).toHaveBeenCalledWith(1, dto);
    });

    it('should propagate submitAttempt errors', async () => {
      const error = new Error('Unable to submit attempt');

      questionnaireServiceMock.submitAttempt.mockRejectedValue(error);

      await expect(
        controller.submitAttempt(999),
      ).rejects.toThrow(error);

      expect(
        questionnaireServiceMock.submitAttempt,
      ).toHaveBeenCalledWith(999);
    });
  });
});
