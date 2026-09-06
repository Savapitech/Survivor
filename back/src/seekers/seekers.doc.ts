import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, getSchemaPath, ApiBody, ApiProperty } from '@nestjs/swagger';
import { Seeker } from './entities/seeker.entity';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { FindSeekersQueryDto } from './dto/find-seekers-query.dto';
import { ModerateSeekerVideoDto } from './dto/moderate-seeker-video.dto';
import { FindSeekersAdminQueryDto } from './dto/find-seekers-admin-query.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';

class SeekerWithLikeCount extends Seeker {
  @ApiProperty({
    example: 0,
    description: 'Number of likes received by the seeker.',
  })
    likeCount: number;
}

export function docSeekersPost() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Create a seeker',
            description: 'Create a seeker profile for an existing user.',
        }),
        ApiParam({
            name: "seeker's data",
            type: CreateSeekerDto,
            description: "All seeker's data"
        }),
        ApiResponse({
            status: 201,
            type: Seeker,
            description: 'Seeker successfully created.',
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid seeker data.',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'name should not be empty',
                    error: 'Invalid user data',
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
            status: 404,
            description: 'userId does not match an existing user',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'User not found',
                    error: 'Not Found',
                },
            },
        }),
        ApiResponse({
            status: 409,
            description: 'Error: Conflict',
            schema: {
                example: {
                    statusCode: 409,
                    message: 'This user already has a seeker profile',
                    error: 'Conflict',
                },
            },
        }),
        ApiResponse({
            status: 422,
            description:
                'Invalid body (missing field, video not a YouTube/Vimeo link, ...)',
            schema: {
                example: {
                    statusCode: 422,
                    message: [
                        'name should not be empty',
                        'video must be a URL address'
                    ],
                    error: 'Unprocessable Entity',
                },
            },
        })
    );
}

export function docSeekersGet() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get all seekers',
            description: "Paginated, filterable public feed of seeker profiles.",
        }),
        ApiParam({
            name: "looker filter",
            type: FindSeekersQueryDto,
            description: "All filters"
        }),
        ApiResponse({
            status: 200,
            schema: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Seeker),
                        },
                    },
                    total: {
                        type: 'number',
                        example: 1,
                    },
                    page: {
                        type: 'number',
                        example: 1,
                    },
                    pageSize: {
                        type: 'number',
                        example: 10,
                    },
                    totalPages: {
                        type: 'number',
                        example: 1,
                    },
                },
            },
            description: 'All seekers.',
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Invalid filter',
                    error: 'Error: Bad Request',
                },
            },
        }),
    );
}

export function docSeekersGetByUserId() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get the seeker profile linked to a user id',
            description: 'Returns the seeker profile linked to the specified user ID.',
        }),
        ApiParam({
            name: 'userId',
            required: true,
            type: String,
            format: 'uuid',
            description: "The user's unique identifier.",
            example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
        }),
        ApiResponse({
            status: 200,
            type: SeekerWithLikeCount,
            description: 'Seeker successfully retrieved.',
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Validation failed (uuid is expected)',
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Seeker profile not found for this user.',
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

export function docSeekersGetAdmin() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get all seekers as an administrator',
            description: 'Returns every seeker profile without filtering by certification, age, or video status.',
        }),
        ApiQuery({
            name: 'page',
            required: false,
            type: Number,
            description: 'Page number.',
            example: 1,
        }),
        ApiQuery({
            name: 'pageSize',
            required: false,
            type: Number,
            description: 'Number of seekers per page.',
            example: 10,
        }),
        ApiQuery({
            name: 'query',
            required: false,
            type: FindSeekersAdminQueryDto,
        }),
        ApiResponse({
            status: 200,
            description: 'Seeker profiles successfully retrieved.',
            schema: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array', items: {
                            $ref: getSchemaPath(Seeker),
                        },
                    },
                    total: {
                        type: 'number',
                        example: 25,
                    },
                    page: {
                        type: 'number',
                        example: 1,
                    },
                    pageSize: {
                        type: 'number',
                        example: 10,
                    },
                    totalPages: {
                        type: 'number',
                        example: 3,
                    },
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
    );
}

export function docSeekersPatch() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: "Moderate a seeker's video",
            description: "Approves or rejects a seeker's video as an administrator.",
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: Number,
            description: "The seeker's unique identifier.",
            example: 42,
        }),
        ApiBody({
            type: ModerateSeekerVideoDto,
            required: true,
            description: 'Video moderation decision.',
        }),
        ApiResponse({
            status: 200,
            type: Seeker,
            description: "Seeker's video successfully moderated.",
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

export function docSeekersGetById() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get all seekers',
            description: "Paginated, filterable public feed of seeker profiles.",
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: Number,
            description: "The seeker's unique identifier.",
            example: 42,
        }),
        ApiQuery({
            name: 'recruiterId',
            required: false,
            type: Number,
            description: 'Optional recruiter ID used to customize the returned seeker data.',
            example: 12,
        }),
        ApiQuery({
            name: 'viewerId',
            required: false,
            type: String,
            description: 'Optional viewer identifier used to customize the returned seeker data.',
            example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
        }),
        ApiResponse({
            status: 201,
            schema: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(Seeker),
                        },
                    },
                    total: {
                        type: 'number',
                        example: 1,
                    },
                    page: {
                        type: 'number',
                        example: 1,
                    },
                    pageSize: {
                        type: 'number',
                        example: 10,
                    },
                    totalPages: {
                        type: 'number',
                        example: 1,
                    },
                },
            },
            description: 'Seeker successfully created.',
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'No seeker with this id',
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

export function docSeekersPatchById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: "Update a seeker's profile",
            description: "Updates the seeker's profile with the provided information.",
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: Number,
            description: "The seeker's unique identifier.",
            example: 42,
        }),
        ApiBody({
            type: UpdateSeekerDto,
            required: true,
            description: "Updated seeker's data.",
        }),
        ApiResponse({
            status: 200,
            type: Seeker,
            description: 'Seeker successfully updated.',
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
        ApiResponse({
            status: 422,
            description: 'Error: Unprocessable Entity',
            schema: {
                example: {
                    statusCode: 422,
                    message: ['Invalid seeker data'],
                    error: 'Unprocessable Entity',
                },
            },
        }),
    );
}

export function docSeekersDeleteById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Delete a seeker profile',
            description: 'Deletes the specified seeker profile.',
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: Number,
            description: "The seeker's unique identifier.",
            example: 42,
        }),
        ApiResponse({
            status: 200,
            description: 'Seeker successfully deleted.',
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