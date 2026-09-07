import { applyDecorators } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import { Localisation } from './entities/localisation.entity';
import { PaginationQueryDto } from '../common/pagination';

export function docLocalisationsPost() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a localisation',
      description: 'Creates a new localisation. Admin access required.',
    }),
    ApiBody({
      type: CreateLocalisationDto,
      description: 'Localisation data',
    }),
    ApiResponse({
      status: 201,
      description: 'Localisation successfully created.',
      type: Localisation,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['localisation must be a string'],
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
          message: 'Localisation already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function docLocalisationsGet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all localisations',
      description: 'Returns a paginated list of localisations.',
    }),
    ApiQuery({
      name: 'pagination',
      required: false,
      type: PaginationQueryDto,
      description: 'paginate localisations',
    }),
    ApiResponse({
      status: 200,
      description: 'Localisations successfully retrieved.',
      schema: {
        example: {
          data: [
            {
              id: 1,
              localisation: 'Rennes',
            },
            {
              id: 2,
              localisation: 'Paris',
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

export function docLocalisationsGetById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a localisation by id',
      description: 'Returns a single localisation using its numeric id.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Localisation id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Localisation successfully retrieved.',
      type: Localisation,
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
          message: 'Localisation not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function docLocalisationsPatch() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a localisation',
      description: 'Updates an existing localisation. Admin access required.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Localisation id.',
    }),
    ApiBody({
      type: UpdateLocalisationDto,
      description: 'Localisation fields to update.',
    }),
    ApiResponse({
      status: 200,
      description: 'Localisation successfully updated.',
      type: Localisation,
    }),
    ApiResponse({
      status: 400,
      description: 'Error: Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: ['localisation must be a string'],
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
          message: 'Localisation not found',
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
          message: 'Localisation already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function docLocalisationsDelete() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a localisation',
      description: 'Deletes an existing localisation. Admin access required.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Localisation id.',
    }),
    ApiResponse({
      status: 200,
      description: 'Localisation successfully deleted.',
      schema: {
        example: {
          message: 'Localisation successfully deleted',
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
          message: 'Localisation not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
