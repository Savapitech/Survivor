import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { FindThreadQueryDto } from './dto/find-thread-query.dto';
import { MarkThreadSeenDto } from './dto/mark-thread-seen.dto';

describe('MessagesController', () => {
    let controller: MessagesController;

    const messagesServiceMock = {
        create: jest.fn(),
        findThread: jest.fn(),
        conversationsForRecruiter: jest.fn(),
        conversationsForSeeker: jest.fn(),
        markThreadSeen: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MessagesController],
            providers: [
                {
                    provide: MessagesService,
                    useValue: messagesServiceMock,
                },
            ],
        }).compile();

        controller = module.get<MessagesController>(MessagesController);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a message', async () => {
            const dto = {
                recruiterId: 1,
                seekerId: 2,
                content: 'Bonjour, votre profil nous intéresse.',
            } as CreateMessageDto;

            const expectedResult = {
                id: 1,
                ...dto,
            };

            messagesServiceMock.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(result).toEqual(expectedResult);

            expect(messagesServiceMock.create).toHaveBeenCalledTimes(1);
            expect(messagesServiceMock.create).toHaveBeenCalledWith(dto);
        });

        it('should pass the dto unchanged to the service', async () => {
            const dto = {
                recruiterId: 10,
                seekerId: 20,
                content: 'Message de test',
            } as CreateMessageDto;

            messagesServiceMock.create.mockResolvedValue({
                id: 1,
            });

            await controller.create(dto);

            expect(messagesServiceMock.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findThread', () => {
        it('should return a message thread', async () => {
            const query = {
                recruiterId: 1,
                seekerId: 2,
            } as FindThreadQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        recruiterId: 1,
                        seekerId: 2,
                        content: 'Bonjour',
                    },
                    {
                        id: 2,
                        recruiterId: 1,
                        seekerId: 2,
                        content: 'Bonjour, merci.',
                    },
                ],
                total: 2,
            };

            messagesServiceMock.findThread.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.findThread(query);

            expect(result).toEqual(expectedResult);

            expect(messagesServiceMock.findThread).toHaveBeenCalledTimes(1);
            expect(messagesServiceMock.findThread).toHaveBeenCalledWith(query);
        });

        it('should pass the query unchanged to the service', async () => {
            const query = {
                recruiterId: 42,
                seekerId: 100,
            } as FindThreadQueryDto;

            messagesServiceMock.findThread.mockResolvedValue([]);

            await controller.findThread(query);

            expect(messagesServiceMock.findThread).toHaveBeenCalledWith(
                query,
            );
        });
    });

    describe('conversationsForRecruiter', () => {
        it('should return conversations for a recruiter', async () => {
            const recruiterId = 1;

            const expectedResult = [
                {
                    recruiterId,
                    seekerId: 2,
                    lastMessage: 'Bonjour',
                },
                {
                    recruiterId,
                    seekerId: 3,
                    lastMessage: 'Merci pour votre retour',
                },
            ];

            messagesServiceMock.conversationsForRecruiter.mockResolvedValue(
                expectedResult,
            );

            const result =
                await controller.conversationsForRecruiter(recruiterId);

            expect(result).toEqual(expectedResult);

            expect(
                messagesServiceMock.conversationsForRecruiter,
            ).toHaveBeenCalledTimes(1);

            expect(
                messagesServiceMock.conversationsForRecruiter,
            ).toHaveBeenCalledWith(recruiterId);
        });

        it('should pass the recruiterId unchanged to the service', async () => {
            const recruiterId = 42;

            messagesServiceMock.conversationsForRecruiter.mockResolvedValue(
                [],
            );

            await controller.conversationsForRecruiter(recruiterId);

            expect(
                messagesServiceMock.conversationsForRecruiter,
            ).toHaveBeenCalledWith(recruiterId);
        });
    });

    describe('conversationsForSeeker', () => {
        it('should return conversations for a seeker', async () => {
            const seekerId = 2;

            const expectedResult = [
                {
                    recruiterId: 1,
                    seekerId,
                    lastMessage: 'Bonjour',
                },
                {
                    recruiterId: 5,
                    seekerId,
                    lastMessage: 'Nous avons étudié votre profil.',
                },
            ];

            messagesServiceMock.conversationsForSeeker.mockResolvedValue(
                expectedResult,
            );

            const result =
                await controller.conversationsForSeeker(seekerId);

            expect(result).toEqual(expectedResult);

            expect(
                messagesServiceMock.conversationsForSeeker,
            ).toHaveBeenCalledTimes(1);

            expect(
                messagesServiceMock.conversationsForSeeker,
            ).toHaveBeenCalledWith(seekerId);
        });

        it('should pass the seekerId unchanged to the service', async () => {
            const seekerId = 42;

            messagesServiceMock.conversationsForSeeker.mockResolvedValue(
                [],
            );

            await controller.conversationsForSeeker(seekerId);

            expect(
                messagesServiceMock.conversationsForSeeker,
            ).toHaveBeenCalledWith(seekerId);
        });
    });

    describe('markThreadSeen', () => {
        it('should mark a thread as seen', async () => {
            const dto = {
                recruiterId: 1,
                seekerId: 2,
            } as MarkThreadSeenDto;

            const expectedResult = {
                success: true,
            };

            messagesServiceMock.markThreadSeen.mockResolvedValue(
                expectedResult,
            );

            const result = await controller.markThreadSeen(dto);

            expect(result).toEqual(expectedResult);

            expect(
                messagesServiceMock.markThreadSeen,
            ).toHaveBeenCalledTimes(1);

            expect(
                messagesServiceMock.markThreadSeen,
            ).toHaveBeenCalledWith(dto);
        });

        it('should pass the dto unchanged to the service', async () => {
            const dto = {
                recruiterId: 10,
                seekerId: 20,
            } as MarkThreadSeenDto;

            messagesServiceMock.markThreadSeen.mockResolvedValue({
                success: true,
            });

            await controller.markThreadSeen(dto);

            expect(
                messagesServiceMock.markThreadSeen,
            ).toHaveBeenCalledWith(dto);
        });
    });

    describe('service errors', () => {
        it('should propagate create errors', async () => {
            const dto = {} as CreateMessageDto;
            const error = new Error('Create message failed');

            messagesServiceMock.create.mockRejectedValue(error);

            await expect(
                controller.create(dto),
            ).rejects.toThrow(error);

            expect(
                messagesServiceMock.create,
            ).toHaveBeenCalledWith(dto);
        });

        it('should propagate findThread errors', async () => {
            const query = {} as FindThreadQueryDto;
            const error = new Error('Find thread failed');

            messagesServiceMock.findThread.mockRejectedValue(error);

            await expect(
                controller.findThread(query),
            ).rejects.toThrow(error);

            expect(
                messagesServiceMock.findThread,
            ).toHaveBeenCalledWith(query);
        });

        it('should propagate recruiter conversations errors', async () => {
            const recruiterId = 1;
            const error = new Error(
                'Recruiter conversations failed',
            );

            messagesServiceMock.conversationsForRecruiter.mockRejectedValue(
                error,
            );

            await expect(
                controller.conversationsForRecruiter(recruiterId),
            ).rejects.toThrow(error);

            expect(
                messagesServiceMock.conversationsForRecruiter,
            ).toHaveBeenCalledWith(recruiterId);
        });

        it('should propagate seeker conversations errors', async () => {
            const seekerId = 1;
            const error = new Error(
                'Seeker conversations failed',
            );

            messagesServiceMock.conversationsForSeeker.mockRejectedValue(
                error,
            );

            await expect(
                controller.conversationsForSeeker(seekerId),
            ).rejects.toThrow(error);

            expect(
                messagesServiceMock.conversationsForSeeker,
            ).toHaveBeenCalledWith(seekerId);
        });

        it('should propagate markThreadSeen errors', async () => {
            const dto = {
                recruiterId: 1,
                seekerId: 2,
            } as MarkThreadSeenDto;

            const error = new Error('Mark thread seen failed');

            messagesServiceMock.markThreadSeen.mockRejectedValue(error);

            await expect(
                controller.markThreadSeen(dto),
            ).rejects.toThrow(error);

            expect(
                messagesServiceMock.markThreadSeen,
            ).toHaveBeenCalledWith(dto);
        });
    });
});
