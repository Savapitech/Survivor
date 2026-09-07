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

import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { Recruiter } from './entities/recruiter.entity';
import { PaginationQueryDto } from '../common/pagination';

export function docRecruitersPost() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Create a recruiter profile',
      description: 'Creates a new recruiter profile.',
    }),
    ApiBody({
      type: CreateRecruiterDto,
      description: 'Recruiter profile data',
    }),
    ApiResponse({
      status: 201,
      description: 'Recruiter successfully created.',
      type: Recruiter,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['Invalid data'],
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
      status: 409,
      description: 'Error: Conflict',
      schema: {
        example: {
          statusCode: 409,
          message: 'Recruiter already exists',
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
          message: ["company's name should not be empty"],
          error: 'Unprocessable Entity',
        },
      },
    }),
  );
}

export function docRecruitersGet() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Get all recruiter profiles',
      description: 'Returns a paginated list of recruiter profiles.',
    }),
    ApiQuery({
      name: 'pagination',
      required: false,
      type: PaginationQueryDto,
      description: 'paginate user',
    }),
    ApiResponse({
      status: 200,
      description: 'Recruiters successfully retrieved.',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(Recruiter),
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

export function docRecruitersGetByUserId() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Get a recruiter profile by user id',
      description:
        'Returns the recruiter profile associated with the specified user id.',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      format: 'uuid',
      example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
      description: 'UUID of the user associated with the recruiter.',
    }),
    ApiResponse({
      status: 200,
      description: 'Recruiter successfully retrieved.',
      type: Recruiter,
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

export function docRecruitersGetById() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Get a recruiter profile by id',
      description: 'Returns a single recruiter profile using its numeric id.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Recruiter profile id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Recruiter successfully retrieved.',
      type: Recruiter,
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

export function docRecruitersPatch() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Update a recruiter profile',
      description: 'Updates an existing recruiter profile.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Recruiter profile id.',
    }),
    ApiBody({
      type: UpdateRecruiterDto,
      description: 'Recruiter fields to update.',
    }),
    ApiResponse({
      status: 200,
      description: 'Recruiter successfully updated.',
      type: Recruiter,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['Invalid data'],
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
    ApiResponse({
      status: 422,
      description: 'Error: Unprocessable Entity',
      schema: {
        example: {
          statusCode: 422,
          message: ["company's name should not be empty"],
          error: 'Unprocessable Entity',
        },
      },
    }),
  );
}

export function docRecruitersDelete() {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    ApiOperation({
      summary: 'Delete a recruiter profile',
      description: 'Deletes an existing recruiter profile.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Recruiter profile id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Recruiter successfully deleted.',
      schema: {
        example: {
          message: 'Recruiter successfully deleted',
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
          message: 'Recruiter not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
