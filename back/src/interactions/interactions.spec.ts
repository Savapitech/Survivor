
import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';

import { CreateInteractionDto } from './dto/create-interaction.dto';
import { FindInteractionsQueryDto } from './dto/find-interactions-query.dto';
import { MarkAllSeenDto } from './dto/mark-all-seen.dto';
import { RemoveFavoriteQueryDto } from './dto/remove-favorite-query.dto';
import { InteractionType } from './entities/interaction.entity';

describe('InteractionsController', () => {
    let controller: InteractionsController;

    const interactionsServiceMock = {
        create: jest.fn(),
        findSent: jest.fn(),
        findReceived: jest.fn(),
        countUnread: jest.fn(),
        markAllSeen: jest.fn(),
        removeFavorite: jest.fn(),
        markSeen: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InteractionsController],
            providers: [
                {
                    provide: InteractionsService,
                    useValue: interactionsServiceMock,
                },
            ],
        }).compile();

        controller = module.get<InteractionsController>(
            InteractionsController,
        );

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create an interaction', async () => {
            const dto = {
                recruiterId: 1,
                seekerId: 2,
                type: InteractionType.CONTACT,
            } as CreateInteractionDto;

            const expectedResult = {
                id: 1,
                ...dto,
            };

            interactionsServiceMock.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(result).toEqual(expectedResult);

            expect(interactionsServiceMock.create).toHaveBeenCalledTimes(1);
            expect(interactionsServiceMock.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findSent', () => {
        it('should return sent interactions', async () => {
            const recruiterId = 1;

            const query = {
                page: 1,
                pageSize: 20,
            } as FindInteractionsQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        recruiterId,
                        seekerId: 2,
                    },
                ],
                total: 1,
                page: 1,
                pageSize: 20,
            };

            interactionsServiceMock.findSent.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.findSent(
                recruiterId,
                query,
            );

            expect(result).toEqual(expectedResult);

            expect(interactionsServiceMock.findSent).toHaveBeenCalledTimes(1);
            expect(interactionsServiceMock.findSent).toHaveBeenCalledWith(
                recruiterId,
                query,
            );
        });

        it('should pass recruiterId and query unchanged', async () => {
            const recruiterId = 42;

            const query = {
                page: 2,
                pageSize: 10,
            } as FindInteractionsQueryDto;

            interactionsServiceMock.findSent.mockResolvedValue([]);

            await controller.findSent(recruiterId, query);

            expect(interactionsServiceMock.findSent).toHaveBeenCalledWith(
                recruiterId,
                query,
            );
        });
    });

    describe('findReceived', () => {
        it('should return received interactions', async () => {
            const seekerId = 2;

            const query = {
                page: 1,
                pageSize: 20,
            } as FindInteractionsQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        recruiterId: 1,
                        seekerId,
                    },
                ],
                total: 1,
                page: 1,
                pageSize: 20,
            };

            interactionsServiceMock.findReceived.mockResolvedValue(
                expectedResult,
            );

            const req = { user: { userId: 'user-2', role: 'seeker' } };

            const result = await controller.findReceived(
                seekerId,
                query,
                req,
            );

            expect(result).toEqual(expectedResult);

            expect(
                interactionsServiceMock.findReceived,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.findReceived,
            ).toHaveBeenCalledWith(seekerId, query, req.user);
        });

        it('should pass seekerId and query unchanged', async () => {
            const seekerId = 42;

            const query = {
                page: 2,
                pageSize: 10,
            } as FindInteractionsQueryDto;

            const req = { user: { userId: 'user-42', role: 'seeker' } };

            interactionsServiceMock.findReceived.mockResolvedValue([]);

            await controller.findReceived(seekerId, query, req);

            expect(
                interactionsServiceMock.findReceived,
            ).toHaveBeenCalledWith(seekerId, query, req.user);
        });
    });

    describe('countUnread', () => {
        it('should return the unread interaction count', async () => {
            const seekerId = 2;
            const req = { user: { userId: 'user-2', role: 'seeker' } };
            const expectedResult = 5;

            interactionsServiceMock.countUnread.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.countUnread(seekerId, req);

            expect(result).toBe(expectedResult);

            expect(
                interactionsServiceMock.countUnread,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.countUnread,
            ).toHaveBeenCalledWith(seekerId, req.user);
        });
    });

    describe('markAllSeen', () => {
        it('should mark all interactions as seen', async () => {
            const dto = {
                seekerId: 2,
            } as MarkAllSeenDto;
            const req = { user: { userId: 'user-2', role: 'seeker' } };

            const expectedResult = {
                success: true,
            };

            interactionsServiceMock.markAllSeen.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.markAllSeen(dto, req);

            expect(result).toEqual(expectedResult);

            expect(
                interactionsServiceMock.markAllSeen,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.markAllSeen,
            ).toHaveBeenCalledWith(dto.seekerId, req.user);
        });

        it('should pass only seekerId to the service', async () => {
            const dto = {
                seekerId: 42,
            } as MarkAllSeenDto;
            const req = { user: { userId: 'user-42', role: 'seeker' } };

            interactionsServiceMock.markAllSeen.mockResolvedValue({
                success: true,
            });

            await controller.markAllSeen(dto, req);

            expect(
                interactionsServiceMock.markAllSeen,
            ).toHaveBeenCalledWith(42, req.user);
        });
    });

    describe('removeFavorite', () => {
        it('should remove a favorite', async () => {
            const query = {
                recruiterId: 1,
                seekerId: 2,
            } as RemoveFavoriteQueryDto;

            const expectedResult = {
                success: true,
            };

            interactionsServiceMock.removeFavorite.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.removeFavorite(query);

            expect(result).toEqual(expectedResult);

            expect(
                interactionsServiceMock.removeFavorite,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.removeFavorite,
            ).toHaveBeenCalledWith(
                query.recruiterId,
                query.seekerId,
            );
        });

        it('should pass recruiterId and seekerId to the service', async () => {
            const query = {
                recruiterId: 10,
                seekerId: 20,
            } as RemoveFavoriteQueryDto;

            interactionsServiceMock.removeFavorite.mockResolvedValue({
                success: true,
            });

            await controller.removeFavorite(query);

            expect(
                interactionsServiceMock.removeFavorite,
            ).toHaveBeenCalledWith(10, 20);
        });
    });

    describe('markSeen', () => {
        it('should mark an interaction as seen', async () => {
            const id = 1;
            const seekerId = 2;
            const req = { user: { userId: 'user-2', role: 'seeker' } };

            const expectedResult = {
                id,
                seen: true,
            };

            interactionsServiceMock.markSeen.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.markSeen(id, seekerId, req);

            expect(result).toEqual(expectedResult);

            expect(
                interactionsServiceMock.markSeen,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.markSeen,
            ).toHaveBeenCalledWith(id, seekerId, req.user);
        });

        it('should pass id and seekerId unchanged', async () => {
            const id = 42;
            const seekerId = 100;
            const req = { user: { userId: 'user-100', role: 'seeker' } };

            interactionsServiceMock.markSeen.mockResolvedValue({
                id,
                seen: true,
            });

            await controller.markSeen(id, seekerId, req);

            expect(
                interactionsServiceMock.markSeen,
            ).toHaveBeenCalledWith(id, seekerId, req.user);
        });
    });

    describe('findOne', () => {
        it('should return an interaction by id', async () => {
            const id = 1;

            const expectedResult = {
                id,
                recruiterId: 10,
                seekerId: 20,
            };

            interactionsServiceMock.findOne.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.findOne(id);

            expect(result).toEqual(expectedResult);

            expect(
                interactionsServiceMock.findOne,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.findOne,
            ).toHaveBeenCalledWith(id);
        });

        it('should pass the id unchanged to the service', async () => {
            const id = 42;

            interactionsServiceMock.findOne.mockResolvedValue({
                id,
            });

            await controller.findOne(id);

            expect(
                interactionsServiceMock.findOne,
            ).toHaveBeenCalledWith(id);
        });
    });

    describe('remove', () => {
        it('should remove an interaction', async () => {
            const id = 1;

            const expectedResult = {
                success: true,
            };

            interactionsServiceMock.remove.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.remove(id);

            expect(result).toEqual(expectedResult);

            expect(
                interactionsServiceMock.remove,
            ).toHaveBeenCalledTimes(1);

            expect(
                interactionsServiceMock.remove,
            ).toHaveBeenCalledWith(id);
        });
    });

    describe('service errors', () => {
        it('should propagate create errors', async () => {
            const dto = {
                recruiterId: 1,
                seekerId: 2,
            } as CreateInteractionDto;

            const error = new Error('Create failed');

            interactionsServiceMock.create.mockRejectedValue(error);

            await expect(
                controller.create(dto),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.create,
            ).toHaveBeenCalledWith(dto);
        });

        it('should propagate findSent errors', async () => {
            const recruiterId = 1;
            const query = {} as FindInteractionsQueryDto;
            const error = new Error('Find sent failed');

            interactionsServiceMock.findSent.mockRejectedValue(error);

            await expect(
                controller.findSent(recruiterId, query),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.findSent,
            ).toHaveBeenCalledWith(recruiterId, query);
        });

        it('should propagate findReceived errors', async () => {
            const seekerId = 1;
            const query = {} as FindInteractionsQueryDto;
            const req = { user: { userId: 'user-1', role: 'seeker' } };
            const error = new Error('Find received failed');

            interactionsServiceMock.findReceived.mockRejectedValue(error);

            await expect(
                controller.findReceived(seekerId, query, req),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.findReceived,
            ).toHaveBeenCalledWith(seekerId, query, req.user);
        });

        it('should propagate countUnread errors', async () => {
            const req = { user: { userId: 'user-1', role: 'seeker' } };
            const error = new Error('Count unread failed');

            interactionsServiceMock.countUnread.mockRejectedValue(error);

            await expect(
                controller.countUnread(1, req),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.countUnread,
            ).toHaveBeenCalledWith(1, req.user);
        });

        it('should propagate markAllSeen errors', async () => {
            const dto = {
                seekerId: 1,
            } as MarkAllSeenDto;
            const req = { user: { userId: 'user-1', role: 'seeker' } };

            const error = new Error('Mark all seen failed');

            interactionsServiceMock.markAllSeen.mockRejectedValue(error);

            await expect(
                controller.markAllSeen(dto, req),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.markAllSeen,
            ).toHaveBeenCalledWith(dto.seekerId, req.user);
        });

        it('should propagate removeFavorite errors', async () => {
            const query = {
                recruiterId: 1,
                seekerId: 2,
            } as RemoveFavoriteQueryDto;

            const error = new Error('Remove favorite failed');

            interactionsServiceMock.removeFavorite.mockRejectedValue(
                error,
            );

            await expect(
                controller.removeFavorite(query),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.removeFavorite,
            ).toHaveBeenCalledWith(1, 2);
        });

        it('should propagate markSeen errors', async () => {
            const req = { user: { userId: 'user-2', role: 'seeker' } };
            const error = new Error('Mark seen failed');

            interactionsServiceMock.markSeen.mockRejectedValue(error);

            await expect(
                controller.markSeen(1, 2, req),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.markSeen,
            ).toHaveBeenCalledWith(1, 2, req.user);
        });

        it('should propagate findOne errors', async () => {
            const error = new Error('Interaction not found');

            interactionsServiceMock.findOne.mockRejectedValue(error);

            await expect(
                controller.findOne(999),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.findOne,
            ).toHaveBeenCalledWith(999);
        });

        it('should propagate remove errors', async () => {
            const error = new Error('Remove failed');

            interactionsServiceMock.remove.mockRejectedValue(error);

            await expect(
                controller.remove(999),
            ).rejects.toThrow(error);

            expect(
                interactionsServiceMock.remove,
            ).toHaveBeenCalledWith(999);
        });
    });
});
