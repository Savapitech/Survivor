import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiHeader } from '@nestjs/swagger';

export function docAuthPost() {
    return applyDecorators(
        ApiOperation({
            summary: 'login an user',
            description: 'Try to login the user.',
        }),
        ApiResponse({
            status: 201,
            description: 'User successfully login.',
        }),
        ApiResponse({
            status: 400,
            description: 'Bad Request.',
            schema: {
                example: {
                    statusCode: 400,
                    message: [
                        'name should not be empty',
                        'password should not be empty'
                    ],
                    error: 'Bad Request',
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Error: Not Found',
            schema: {
                example: {
                    statusCode: 404,
                    message: 'Not Found',
                },
            },
        })
    );
}