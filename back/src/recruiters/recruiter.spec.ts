import { Test, TestingModule } from '@nestjs/testing';
import { RecruitersController } from './recruiters.controller';
import { RecruitersService } from './recruiters.service';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('RecruitersController', () => {
    let controller: RecruitersController;

    const recruitersServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByUserId: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecruitersController],
            providers: [
                {
                    provide: RecruitersService,
                    useValue: recruitersServiceMock,
                },
            ],
        }).compile();

        controller = module.get<RecruitersController>(RecruitersController);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a recruiter', async () => {
            const dto = {
                userId: 'user-uuid-123',
                companyName: 'company',
            } as CreateRecruiterDto;

            const expectedResult = {
                id: 1,
                ...dto,
            };

            recruitersServiceMock.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(result).toEqual(expectedResult);
            expect(recruitersServiceMock.create).toHaveBeenCalledTimes(1);
            expect(recruitersServiceMock.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all recruiters', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        companyName: 'company',
                    },
                    {
                        id: 2,
                        companyName: 'ProfilActif',
                    },
                ],
                total: 2,
                page: 1,
                pageSize: 20,
            };

            recruitersServiceMock.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(query);

            expect(result).toEqual(expectedResult);
            expect(recruitersServiceMock.findAll).toHaveBeenCalledTimes(1);
            expect(recruitersServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should pass the query unchanged to the service', async () => {
            const query = {
                page: 2,
                pageSize: 10,
            } as PaginationQueryDto;

            recruitersServiceMock.findAll.mockResolvedValue([]);

            await controller.findAll(query);

            expect(recruitersServiceMock.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findByUserId', () => {
        it('should return a recruiter by user id', async () => {
            const userId = '550e8400-e29b-41d4-a716-446655440000';

            const expectedResult = {
                id: 1,
                userId,
                companyName: 'company',
            };

            recruitersServiceMock.findByUserId.mockResolvedValue(expectedResult);

            const result = await controller.findByUserId(userId);

            expect(result).toEqual(expectedResult);
            expect(recruitersServiceMock.findByUserId).toHaveBeenCalledTimes(1);
            expect(recruitersServiceMock.findByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('findOne', () => {
        it('should return a recruiter by id', async () => {
            const id = 1;

            const expectedResult = {
                id,
                companyName: 'company',
            };

            recruitersServiceMock.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(result).toEqual(expectedResult);
            expect(recruitersServiceMock.findOne).toHaveBeenCalledTimes(1);
            expect(recruitersServiceMock.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update a recruiter', async () => {
            const id = 1;

            const dto = {
                companyName: 'company Updated',
            } as UpdateRecruiterDto;

            const req = { user: { userId: 'user-uuid-123', role: 'recruiter' } };

            const expectedResult = {
                id,
                companyName: 'company Updated',
            };

            recruitersServiceMock.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, dto, req);

            expect(result).toEqual(expectedResult);
            expect(recruitersServiceMock.update).toHaveBeenCalledTimes(1);
            expect(recruitersServiceMock.update).toHaveBeenCalledWith(id, dto, req.user);
        });
    });

    describe('remove', () => {
        it('should remove a recruiter', async () => {
            const id = 1;
            const req = { user: { userId: 'user-uuid-123', role: 'recruiter' } };

            const result = await controller.remove(id, req);

            expect(result).toBeUndefined();
            expect(recruitersServiceMock.remove).toHaveBeenCalledTimes(1);
            expect(recruitersServiceMock.remove).toHaveBeenCalledWith(id, req.user);
        });
    });

    describe('service errors', () => {
        it('should propagate create errors', async () => {
            const dto = {
                userId: 'user-uuid-123',
            } as CreateRecruiterDto;

            const error = new Error('Create failed');

            recruitersServiceMock.create.mockRejectedValue(error);

            await expect(controller.create(dto)).rejects.toThrow(error);

            expect(recruitersServiceMock.create).toHaveBeenCalledWith(dto);
        });

        it('should propagate findOne errors', async () => {
            const error = new Error('Recruiter not found');

            recruitersServiceMock.findOne.mockRejectedValue(error);

            await expect(controller.findOne(999)).rejects.toThrow(error);

            expect(recruitersServiceMock.findOne).toHaveBeenCalledWith(999);
        });

        it('should propagate update errors', async () => {
            const dto = {
                companyName: 'Updated',
            } as UpdateRecruiterDto;
            const req = { user: { userId: 'user-uuid-123', role: 'recruiter' } };

            const error = new Error('Update failed');

            recruitersServiceMock.update.mockRejectedValue(error);

            await expect(controller.update(1, dto, req)).rejects.toThrow(error);

            expect(recruitersServiceMock.update).toHaveBeenCalledWith(1, dto, req.user);
        });

        it('should propagate remove errors', async () => {
            const req = { user: { userId: 'user-uuid-123', role: 'recruiter' } };
            const error = new Error('Delete failed');

            recruitersServiceMock.remove.mockRejectedValue(error);

            await expect(controller.remove(1, req)).rejects.toThrow(error);

            expect(recruitersServiceMock.remove).toHaveBeenCalledWith(1, req.user);
        });
    });
});
