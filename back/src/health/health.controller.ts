import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorateur';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  async check(@Res() res: Response) {
    const result = await this.healthService.check();
    res.status(result.status === 'ok' ? 200 : 503).json(result);
  }
}
