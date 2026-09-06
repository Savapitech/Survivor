import { applyDecorators } from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';

import { CreateMessageDto } from './dto/create-message.dto';
import { FindThreadQueryDto } from './dto/find-thread-query.dto';
import { MarkThreadSeenDto } from './dto/mark-thread-seen.dto';
import { Message } from './entities/message.entity';

export function docMessagesPost() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Create a message',
            description:
                'Creates a new message between a recruiter and a seeker.',
        }),
        ApiBody({
            type: CreateMessageDto,
            description: 'Message data',
        }),
        ApiResponse({
            status: 201,
            description: 'Message successfully created.',
            type: Message,
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid message data'],
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

export function docMessagesGetThread() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get a message thread',
            description:
                'Returns the messages exchanged between a recruiter and a seeker.',
        }),
        ApiBody({
            type: FindThreadQueryDto,
            description: 'Thread search parameters',
        }),
        ApiResponse({
            status: 200,
            description: 'Message thread successfully retrieved.',
            schema: {
                example: {
                    data: [
                        {
                            id: 1,
                            recruiterId: 1,
                            seekerId: 2,
                            senderType: 'RECRUITER',
                            content: 'Hello, I would like to discuss your profile.',
                            seen: true,
                            createdAt: '2026-01-15T10:30:00.000Z',
                        },
                        {
                            id: 2,
                            recruiterId: 1,
                            seekerId: 2,
                            senderType: 'SEEKER',
                            content: 'Hello, thank you for reaching out.',
                            seen: false,
                            createdAt: '2026-01-15T10:35:00.000Z',
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
                    message: ['Invalid thread search parameters'],
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
                    message: 'Conversation not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docMessagesGetConversationsForRecruiter() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get conversations for a recruiter',
            description:
                'Returns the conversations associated with a recruiter.',
        }),
        ApiQuery({
            name: 'recruiterId',
            type: Number,
            example: 1,
            description: 'Recruiter id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Recruiter conversations successfully retrieved.',
            schema: {
                example: [
                    {
                        seekerId: 2,
                        lastMessage: {
                            id: 15,
                            content: 'Thank you for your message.',
                            senderType: 'SEEKER',
                            seen: false,
                            createdAt: '2026-01-15T10:35:00.000Z',
                        },
                        unreadCount: 1,
                    },
                    {
                        seekerId: 3,
                        lastMessage: {
                            id: 21,
                            content: 'I am available tomorrow afternoon.',
                            senderType: 'SEEKER',
                            seen: true,
                            createdAt: '2026-01-16T14:20:00.000Z',
                        },
                        unreadCount: 0,
                    },
                ],
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
                    message: 'Recruiter not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docMessagesGetConversationsForSeeker() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get conversations for a seeker',
            description:
                'Returns the conversations associated with a seeker.',
        }),
        ApiQuery({
            name: 'seekerId',
            type: Number,
            example: 1,
            description: 'Seeker id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Seeker conversations successfully retrieved.',
            schema: {
                example: [
                    {
                        recruiterId: 1,
                        lastMessage: {
                            id: 15,
                            content: 'Thank you for your message.',
                            senderType: 'SEEKER',
                            seen: false,
                            createdAt: '2026-01-15T10:35:00.000Z',
                        },
                        unreadCount: 1,
                    },
                    {
                        recruiterId: 4,
                        lastMessage: {
                            id: 21,
                            content: 'I am available tomorrow afternoon.',
                            senderType: 'RECRUITER',
                            seen: true,
                            createdAt: '2026-01-16T14:20:00.000Z',
                        },
                        unreadCount: 0,
                    },
                ],
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
                    message: 'Seeker not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docMessagesPostThreadSeen() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Mark a message thread as seen',
            description:
                'Marks all messages in a conversation as seen by the recipient.',
        }),
        ApiBody({
            type: MarkThreadSeenDto,
            description: 'Message thread identification data',
        }),
        ApiResponse({
            status: 200,
            description: 'Message thread successfully marked as seen.',
            schema: {
                example: {
                    updated: 3,
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid thread data'],
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
                    message: 'Conversation not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}