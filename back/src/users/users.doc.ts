import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, OmitType, getSchemaPath } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

class publicUser extends OmitType(User, ['password'] as const) { }

export function docUsersPost() {
    return applyDecorators(
        ApiOperation({
            summary: 'Create a user',
            description: 'Creates a new user with the provided information.',
        }),
        ApiParam({
            name: "User's data",
            type: CreateUserDto,
            description: "All data of the new user"
        }),
        ApiResponse({
            status: 201,
            type: publicUser,
            description: 'User successfully created.',
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid user data.',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'name should not be empty',
                    error: 'Invalid user data',
                },
            },
        }),
        ApiResponse({
            status: 403,
            description: 'Forbiden',
            schema: {
                example: {
                    statusCode: 403,
                    message: 'Creating an admin account requires being authenticated as an admin',
                    error: 'Forbiden',
                },
            },
        }),
        ApiResponse({
            status: 409,
            description: 'Error: Conflict',
            schema: {
                example: {
                    statusCode: 409,
                    message: 'email already in use',
                    error: 'Conflict',
                },
            },
        }),
        ApiResponse({
            status: 422,
            description: 'Error: Unprocessable Entity',
            schema: {
                example: {
                    statusCode: 422,
                    message: [
                        'email must be an email',
                        'password must be longer than or equal to 8 characters',
                        'role must be one of the following values: seeker, recruiter, admin',
                        'Vous devez avoir au moins 16 ans pour vous inscrire.',
                        'birthDate must be a valid ISO 8601 date string'],
                    error: 'Unprocessable Entity',
                },
            },
        })
    );
}


export function docUsersGetAll() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get all users',
            description: 'Returns a paginated list of users.',
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
            description: 'Number of users per page.',
            example: 5,
        }),
        ApiResponse({
            status: 200,
            description: 'Users successfully retrieved.',
            schema: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: getSchemaPath(publicUser),
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
            }
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
            status: 422,
            description: 'Error: Unprocessable Entity',
            schema: {
                example: {
                    statusCode: 422,
                    message: [
                        'page must not be less than 1',
                        'page must be an integer number',
                        'pageSize must not be less than 1',
                        'pageSize must not be greater than 100',
                        'pageSize must be an integer number'],
                    error: 'Unprocessable Entity',
                },
            },
        })
    );
}

export function docUsersGetById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: 'Get user by id',
            description: 'Returns the target user.',
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: String,
            description: "target user's id.",
            example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
        }),
        ApiResponse({
            status: 200,
            type: publicUser,
            description: 'Users successfully retrieved.',
        }),
        ApiResponse({
            status: 400,
            description: 'Error: Bad Request',
            schema: {
                example: {
                    statusCode: 400,
                    message: 'Validation failed (uuid is expected)',
                    error: 'Bad Request'
                }
            }
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
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'User not found',
                    error: 'Not Found',
                }
            }
        }),
    );
}

export function docUsersPatchById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: "Update user's data",
            description: 'Returns the new user with all news data.',
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: String,
            description: "target user's id.",
            example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
        }),
        ApiParam({
            name: "News user's data",
            type: UpdateUserDto,
            description: "Define all news user's data"
        }),
        ApiResponse({
            status: 200,
            type: publicUser,
            description: 'Users successfully retrieved.',
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
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'User not found',
                    error: 'Not Found',
                }
            }
        }),
        ApiResponse({
            status: 422,
            description: 'Error: Unprocessable Entity',
        })
    );
}

export function docUsersDeleteById() {
    return applyDecorators(
        ApiBearerAuth('JWT'),
        ApiOperation({
            summary: "Delete the user",
            description: 'Delete the user.',
        }),
        ApiParam({
            name: 'id',
            required: true,
            type: String,
            description: "target user's id.",
            example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
        }),
        ApiResponse({
            status: 200,
            description: 'Users successfully retrieved.',
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
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'User not found',
                    error: 'Not Found',
                }
            }
        }),
        ApiResponse({
            status: 422,
            description: 'Error: Unprocessable Entity',
        })
    );
}
