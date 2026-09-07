import { applyDecorators } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateCompetenceDto } from './dto/create-competence.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';
import { Competence } from './entities/competence.entity';
import { PaginationQueryDto } from '../common/pagination';

export function docCompetencesPost() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Create a competence',
      description: 'Creates a new competence. Admin access required.',
    }),
    ApiBody({
      type: CreateCompetenceDto,
      description: 'Competence data',
      required: true,
    }),
    ApiResponse({
      status: 201,
      description: 'Competence successfully created.',
      type: Competence,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad request',
      schema: {
        example: {
          statusCode: 400,
          message: ['competence must be a string'],
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
          message: 'Competence already exists',
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
          error: 'Unprocessable Entity',
        },
      },
    }),
  );
}

export function docCompetencesGet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all competences',
      description: 'Returns a paginated list of competences.',
    }),
    ApiQuery({
      name: 'pagination',
      required: false,
      type: PaginationQueryDto,
      description: 'paginate user',
    }),
    ApiResponse({
      status: 200,
      description: 'Competences successfully retrieved.',
      schema: {
        example: {
          data: [
            {
              id: 1,
              competence: 'Communication',
            },
            {
              id: 2,
              competence: 'Leadership',
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

export function docCompetencesGetById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a competence by id',
      description: 'Returns a single competence using its numeric id.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      required: true,
      description: 'Competence id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Competence successfully retrieved.',
      type: Competence,
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
      status: 404,
      description: 'Error: Not Found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Competence not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function docCompetencesPatch() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a competence',
      description: 'Updates an existing competence. Admin access required.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Competence id.',
    }),
    ApiBody({
      type: UpdateCompetenceDto,
      description: 'Competence fields to update.',
    }),
    ApiResponse({
      status: 200,
      description: 'Competence successfully updated.',
      type: Competence,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['competence must be a string'],
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
          message: 'Competence not found',
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
          message: 'Competence already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function docCompetencesDelete() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a competence',
      description: 'Deletes an existing competence. Admin access required.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Competence id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Competence successfully deleted.',
      schema: {
        example: {
          message: 'Competence successfully deleted',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid competence id.',
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
      description: 'Error: Not Found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Competence not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
