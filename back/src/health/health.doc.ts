import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, } from '@nestjs/swagger';

export function docHealthGet() {
    return applyDecorators(
        ApiOperation({
            summary: 'Check application health',
            description: 'Checks the health status of the application and returns the current health status.',
        }),
        ApiResponse({
            status: 200,
            description: 'Application is healthy.',
            schema: {
                example: {
                    status: 'ok',
                },
            },
        }),
        ApiResponse({
            status: 503,
            description: 'Application is unhealthy or a required service is unavailable.',
            schema: {
                example: {
                    status: 'error',
                },
            },
        }),
    );
}
