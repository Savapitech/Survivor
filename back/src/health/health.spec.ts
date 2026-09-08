import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;

  const healthServiceMock = {
    check: jest.fn(),
  };

  const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: healthServiceMock,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);

    jest.clearAllMocks();

    resMock.status = jest.fn().mockReturnThis();
    resMock.json = jest.fn().mockReturnThis();
  });

  describe('check', () => {
    it('devrait retourner 200 et le résultat en JSON lorsque le statut est "ok"', async () => {
      const result = {
        status: 'ok',
        message: 'Service is healthy',
      };

      healthServiceMock.check.mockResolvedValue(result);

      await controller.check(resMock);

      expect(healthServiceMock.check).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(result);
    });

    it('devrait retourner 503 et le résultat en JSON lorsque le statut n’est pas "ok"', async () => {
      const result = {
        status: 'error',
        message: 'Service is unhealthy',
      };

      healthServiceMock.check.mockResolvedValue(result);

      await controller.check(resMock);

      expect(healthServiceMock.check).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(503);
      expect(resMock.json).toHaveBeenCalledWith(result);
    });

    it('devrait transmettre l’erreur du service', async () => {
      const error = new Error('Health check failed');

      healthServiceMock.check.mockRejectedValue(error);

      await expect(controller.check(resMock)).rejects.toThrow(error);

      expect(healthServiceMock.check).toHaveBeenCalledTimes(1);
      expect(resMock.status).not.toHaveBeenCalled();
      expect(resMock.json).not.toHaveBeenCalled();
    });

    it('ne devrait appeler le service qu’une seule fois', async () => {
      const result = {
        status: 'ok',
      };

      healthServiceMock.check.mockResolvedValue(result);

      await controller.check(resMock);

      expect(healthServiceMock.check).toHaveBeenCalledTimes(1);
    });
  });
});
