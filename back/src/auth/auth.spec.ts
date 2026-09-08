import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const localAuthGuardMock = { canActivate: jest.fn().mockReturnValue(true), };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).overrideGuard(LocalAuthGuard).useValue(localAuthGuardMock).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('login', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
    } as LoginUserDto;

    it('devrait valider l’utilisateur puis retourner le résultat du login', async () => {
      const user = {
        id: 1,
        email: dto.email,
      };

      const loginResult = {
        access_token: 'jwt-token',
        user,
      };

      authServiceMock.validateUser.mockResolvedValue(user);
      authServiceMock.login.mockResolvedValue(loginResult);

      const result = await controller.login(dto);

      expect(authServiceMock.validateUser).toHaveBeenCalledTimes(1);
      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      expect(authServiceMock.login).toHaveBeenCalledTimes(1);
      expect(authServiceMock.login).toHaveBeenCalledWith(user);

      expect(result).toEqual(loginResult);
    });

    it('devrait lever une NotFoundException si l’utilisateur est invalide', async () => {
      authServiceMock.validateUser.mockResolvedValue(null);

      await expect(controller.login(dto)).rejects.toThrow(
        new NotFoundException('invalid user'),
      );

      expect(authServiceMock.validateUser).toHaveBeenCalledTimes(1);
      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('devrait lever une NotFoundException si validateUser retourne undefined', async () => {
      authServiceMock.validateUser.mockResolvedValue(undefined);

      await expect(controller.login(dto)).rejects.toThrow(
        new NotFoundException('invalid user'),
      );

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('devrait transmettre l’erreur de validateUser', async () => {
      const error = new Error('Validation failed');

      authServiceMock.validateUser.mockRejectedValue(error);

      await expect(controller.login(dto)).rejects.toThrow(error);

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('devrait transmettre l’erreur de login', async () => {
      const user = {
        id: 1,
        email: dto.email,
      };

      const error = new Error('Login failed');

      authServiceMock.validateUser.mockResolvedValue(user);
      authServiceMock.login.mockRejectedValue(error);

      await expect(controller.login(dto)).rejects.toThrow(error);

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      expect(authServiceMock.login).toHaveBeenCalledWith(user);
    });
  });
});
