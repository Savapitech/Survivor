import { applyDecorators } from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    getSchemaPath,
} from '@nestjs/swagger';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SaveAnswersDto } from './dto/save-answers.dto';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

export function docQuestionnairePost() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Create a questionnaire question',
            description: 'Creates a new questionnaire question. Admin access required.',
        }),
        ApiBody({
            type: CreateQuestionDto,
            description: 'Question data',
        }),
        ApiResponse({
            status: 201,
            description: 'Question successfully created.',
            type: Question,
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid question data'],
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 403,
            description: 'Error: Forbidden',
            schema: {
                example: {
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                },
            },
        }),
    );
}

export function docQuestionnaireGet() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get questionnaire questions',
            description: 'Returns the list of questionnaire questions matching the specified filters.',
        }),
        ApiResponse({
            status: 200,
            description: 'Questions successfully retrieved.',
            schema: {
                example: {
                    data: [
                        {
                            id: 1,
                            question: 'What is your main area of expertise?',
                            active: true,
                        },
                        {
                            id: 2,
                            question: 'How many years of experience do you have?',
                            active: true,
                        },
                    ],
                    total: 2,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid query parameters'],
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
    );
}

export function docQuestionnaireGetById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get a questionnaire question',
            description: 'Returns a single questionnaire question using its numeric id.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Question id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Question successfully retrieved.',
            type: Question,
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Validation failed (numeric string is expected)',
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Question not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docQuestionnairePatch() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Update a questionnaire question',
            description: 'Updates an existing questionnaire question. Admin access required.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Question id.',
        }),
        ApiBody({
            type: UpdateQuestionDto,
            description: 'Question fields to update.',
        }),
        ApiResponse({
            status: 200,
            description: 'Question successfully updated.',
            type: Question,
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid question data'],
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 403,
            description: 'Error: Forbidden',
            schema: {
                example: {
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Question not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docQuestionnaireDelete() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Deactivate a questionnaire question',
            description: 'Deactivates a questionnaire question. The question is not permanently deleted. Admin access required.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Question id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Question successfully deactivated.',
            type: Question,
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Validation failed (numeric string is expected)',
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                    error: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 403,
            description: 'Error: Forbidden',
            schema: {
                example: {
                    statusCode: 403,
                    message: 'Forbidden resource',
                    error: 'Forbidden',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Question not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docQuestionnaireGetCurrentAttempt() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get or create the current questionnaire attempt',
            description: 'Returns the current questionnaire attempt for a seeker, or creates one if no current attempt exists.',
        }),
        ApiQuery({
            name: 'seekerId',
            required: true,
            type: AttemptQueryDto,
            description: 'Seeker profile id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Current questionnaire attempt successfully retrieved or created.',
            schema: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1,
                        description: 'Questionnaire attempt ID.',
                    },
                    score: {
                        type: 'number',
                        nullable: true,
                        example: 75,
                        description: 'Score obtained for the attempt.',
                    },
                    submittedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: '2026-09-06T10:30:00.000Z',
                        description: 'Date and time when the attempt was submitted.',
                    },
                    questions: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Question),
                        },
                        description: 'Questions included in the attempt.',
                    },
                    answers: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Answer),
                        },
                        description: 'Answers provided for the attempt.',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['seekerId must be a number'],
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Seeker not found.',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Seeker not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docQuestionnaireFindAttempt() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get a questionnaire attempt',
            description: 'Returns a questionnaire attempt using its numeric id.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Questionnaire attempt id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Questionnaire attempt successfully retrieved.',
            schema: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1,
                        description: 'Questionnaire attempt ID.',
                    },
                    score: {
                        type: 'number',
                        nullable: true,
                        example: 75,
                        description: 'Score obtained for the attempt.',
                    },
                    submittedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: '2026-09-06T10:30:00.000Z',
                        description: 'Date and time when the attempt was submitted.',
                    },
                    questions: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Question),
                        },
                        description: 'Questions included in the attempt.',
                    },
                    answers: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Answer),
                        },
                        description: 'Answers provided for the attempt.',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Validation failed (numeric string is expected)',
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Questionnaire attempt not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

/**
 * PUT /questionnaire/attempts/:id/answers
 */
export function docQuestionnaireSaveAnswers() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Save questionnaire answers',
            description: 'Saves or updates the answers associated with a questionnaire attempt.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Questionnaire attempt id.',
        }),
        ApiBody({
            type: SaveAnswersDto,
            description: 'Answers to save for the questionnaire attempt.',
        }),
        ApiResponse({
            status: 200,
            description: 'Answers successfully saved.',
            schema: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1,
                        description: 'Questionnaire attempt ID.',
                    },
                    score: {
                        type: 'number',
                        nullable: true,
                        example: 75,
                        description: 'Score obtained for the attempt.',
                    },
                    submittedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: '2026-09-06T10:30:00.000Z',
                        description: 'Date and time when the attempt was submitted.',
                    },
                    questions: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Question),
                        },
                        description: 'Questions included in the attempt.',
                    },
                    answers: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Answer),
                        },
                        description: 'Answers provided for the attempt.',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid answer data'],
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Questionnaire attempt not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docQuestionnaireSubmitAttempt() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Submit a questionnaire attempt',
            description: 'Submits a questionnaire attempt and marks it as completed.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Questionnaire attempt id.',
        }),
        ApiResponse({
            status: 201,
            description: 'Questionnaire attempt successfully submitted.',
            schema: {
                type: 'object',
                properties: {
                    attemptId: {
                        type: 'integer',
                        example: 1,
                        description: 'Questionnaire attempt ID.',
                    },
                    score: {
                        type: 'number',
                        example: 75,
                        description: 'Score obtained for the attempt.',
                    },
                    submittedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: '2026-09-06T10:30:00.000Z',
                        description: 'Date and time when the attempt was submitted.',
                    },
                    certified: {
                        type: 'boolean',
                        example: true,
                        description: 'Say if the user have the certification'
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Questionnaire attempt cannot be submitted',
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Error: Unauthorized',
            schema: {
                example: {
                    statusCode: 401,
                    message: 'Unauthorized',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Questionnaire attempt not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}