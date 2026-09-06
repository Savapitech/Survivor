import { applyDecorators } from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';

import { CreateInteractionDto } from './dto/create-interaction.dto';
import { MarkAllSeenDto } from './dto/mark-all-seen.dto';
import { Interaction } from './entities/interaction.entity';

export function docInteractionsPost() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Create an interaction',
            description: 'Creates a new interaction between a recruiter and a seeker.',
        }),
        ApiBody({
            type: CreateInteractionDto,
            description: 'Interaction data',
        }),
        ApiResponse({
            status: 201,
            description: 'Interaction successfully created.',
            type: Interaction,
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid interaction data'],
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

export function docInteractionsGetRecuiter() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get sent interactions',
            description: 'Returns the list of interactions sent by a recruiter matching the specified filters.',
        }),
        ApiQuery({
            name: 'recruiterId',
            required: true,
            type: Number,
            example: 10,
            description: 'Recruiter id.',
        }),
        ApiQuery({
            name: 'page',
            required: false,
            type: Number,
            example: 1,
            description: 'Page number.',
        }),
        ApiQuery({
            name: 'pageSize',
            required: false,
            type: Number,
            example: 10,
            description: 'Number of interactions returned per page.',
        }),
        ApiResponse({
            status: 200,
            description: 'Sent interactions successfully retrieved.',
            schema: {
                example: {
                    data: [
                        {
                            id: 1,
                            recruiterId: 10,
                            seekerId: 20,
                            type: 'LIKE',
                            seen: true,
                            createdAt: '2026-09-06T10:30:00.000Z',
                        },
                        {
                            id: 2,
                            recruiterId: 10,
                            seekerId: 25,
                            type: 'FAVORITE',
                            seen: false,
                            createdAt: '2026-09-06T11:00:00.000Z',
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
                    message: ['Invalid recruiter id'],
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
                    message: 'recuiter not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docInteractionsGetSeeker() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get received interactions',
            description: 'Returns the list of interactions received by a seeker matching the specified filters.',
        }),
        ApiQuery({
            name: 'seekerId',
            required: true,
            type: Number,
            example: 20,
            description: 'Seeker id.',
        }),
        ApiQuery({
            name: 'page',
            required: false,
            type: Number,
            example: 1,
            description: 'Page number.',
        }),
        ApiQuery({
            name: 'pageSize',
            required: false,
            type: Number,
            example: 10,
            description: 'Number of interactions returned per page.',
        }),
        ApiResponse({
            status: 200,
            description: 'Received interactions successfully retrieved.',
            schema: {
                example: {
                    data: [
                        {
                            id: 1,
                            recruiterId: 10,
                            seekerId: 20,
                            type: 'LIKE',
                            seen: true,
                            createdAt: '2026-09-06T10:30:00.000Z',
                        },
                        {
                            id: 2,
                            recruiterId: 15,
                            seekerId: 20,
                            type: 'FAVORITE',
                            seen: false,
                            createdAt: '2026-09-06T11:00:00.000Z',
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
                    message: ['Invalid seeker id'],
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

export function docInteractionsGetUnread() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Count unread interactions',
            description: 'Returns the number of unread interactions received by a seeker.',
        }),
        ApiQuery({
            name: 'seekerId',
            required: true,
            type: Number,
            example: 20,
            description: 'Seeker id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Unread interactions count successfully retrieved.',
            schema: {
                example: 5,
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

export function docInteractionsPostSeen() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Mark all interactions as seen',
            description: 'Marks all interactions received by a seeker as seen.',
        }),
        ApiBody({
            type: MarkAllSeenDto,
            description: 'Seeker information.',
        }),
        ApiResponse({
            status: 200,
            description: 'All interactions successfully marked as seen.',
            schema: {
                example: {
                    updated: 5,
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

export function docInteractionsDeleteFavorite() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Remove a favorite interaction',
            description: 'Removes the favorite interaction between a recruiter and a seeker.',
        }),
        ApiQuery({
            name: 'recruiterId',
            required: true,
            type: Number,
            example: 10,
            description: 'Recruiter id.',
        }),
        ApiQuery({
            name: 'seekerId',
            required: true,
            type: Number,
            example: 20,
            description: 'Seeker id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Favorite interaction successfully removed.',
            schema: {
                example: {
                    success: true,
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid recruiter or seeker id'],
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
            description: 'Favorite interaction not found.',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Favorite interaction not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docInteractionsDeleteLike() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Remove a like interaction',
            description: 'Removes the like interaction between a recruiter and a seeker.',
        }),
        ApiQuery({
            name: 'recruiterId',
            required: true,
            type: Number,
            example: 10,
            description: 'Recruiter id.',
        }),
        ApiQuery({
            name: 'seekerId',
            required: true,
            type: Number,
            example: 20,
            description: 'Seeker id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Like interaction successfully removed.',
            schema: {
                example: {
                    success: true,
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: ['Invalid recruiter or seeker id'],
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
            description: 'Like interaction not found.',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Like interaction not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docInteractionsPatchSeen() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Mark an interaction as seen',
            description: 'Marks an interaction as seen by its recipient seeker.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Interaction id.',
        }),
        ApiQuery({
            name: 'seekerId',
            required: true,
            type: Number,
            example: 20,
            description: 'Recipient seeker id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Interaction marked as seen.',
            type: Interaction,
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
            status: 403,
            description: 'This interaction does not belong to the given seekerId.',
            schema: {
                example: {
                    statusCode: 403,
                    message: 'This interaction does not belong to you',
                    error: 'Forbidden',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'No interaction with this id.',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Interaction not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docInteractionsGetById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get an interaction',
            description: 'Returns a single interaction using its numeric id.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Interaction id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Interaction successfully retrieved.',
            type: Interaction,
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
                    message: 'Interaction not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}

export function docInteractionsDeleteById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Delete an interaction',
            description: 'Deletes an interaction using its numeric id.',
        }),
        ApiParam({
            name: 'id',
            type: Number,
            example: 1,
            description: 'Interaction id.',
        }),
        ApiResponse({
            status: 200,
            description: 'Interaction successfully deleted.',
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
                    message: 'Interaction not found',
                    error: 'Not Found',
                },
            },
        }),
    );
}