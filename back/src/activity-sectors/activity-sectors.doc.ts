import { applyDecorators } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateActivitySectorDto } from './dto/create-activity-sector.dto';
import { UpdateActivitySectorDto } from './dto/update-activity-sector.dto';
import { ActivitySector } from './entities/activity-sector.entity';
import { PaginationQueryDto } from '../common/pagination';

export function docActivitySectorsPost() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Create an activity sector',
      description: 'Creates a new activity sector. Admin access required.',
    }),
    ApiBody({
      type: CreateActivitySectorDto,
      description: 'Activity sector data',
    }),
    ApiResponse({
      status: 201,
      description: 'Activity sector successfully created.',
      type: ActivitySector,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['activitySector must be a string'],
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
      status: 409,
      description: 'Error: Conflict',
      schema: {
        example: {
          statusCode: 409,
          message: 'Activity sector already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function docActivitySectorsGet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all activity sectors',
      description: 'Returns a paginated list of activity sectors.',
    }),
    ApiQuery({
      name: 'pagination',
      required: false,
      type: PaginationQueryDto,
      description: 'paginate user',
    }),
    ApiResponse({
      status: 200,
      description: 'Activity sectors successfully retrieved.',
      schema: {
        example: {
          data: [
            {
              id: 1,
              activitySector: 'Informatique et numérique',
            },
            {
              id: 2,
              activitySector: 'Commerce',
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
          message: ['page must be a positive number'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function docActivitySectorsGetById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get an activity sector by id',
      description: 'Returns a single activity sector using its numeric id.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Activity sector id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Activity sector successfully retrieved.',
      type: ActivitySector,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid activity sector id.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Activity sector not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Activity sector not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function docActivitySectorsPatch() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Update an activity sector',
      description:
        'Updates an existing activity sector. Admin access required.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Activity sector id.',
    }),
    ApiBody({
      type: UpdateActivitySectorDto,
      description: 'Activity sector fields to update.',
    }),
    ApiResponse({
      status: 200,
      description: 'Activity sector successfully updated.',
      type: ActivitySector,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid activity sector id or data.',
      schema: {
        example: {
          statusCode: 400,
          message: ['activitySector must be a string'],
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
      description: 'Activity sector not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Activity sector not found',
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
          message: 'Activity sector already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function docActivitySectorsDelete() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Delete an activity sector',
      description:
        'Deletes an existing activity sector. Admin access required.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Activity sector id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Activity sector successfully deleted.',
      schema: {
        example: {
          message: 'Activity sector successfully deleted',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid activity sector id.',
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
      description: 'Activity sector not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Activity sector not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
