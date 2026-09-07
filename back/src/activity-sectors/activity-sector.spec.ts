import { Test, TestingModule } from '@nestjs/testing';
import { ActivitySectorsController } from './activity-sectors.controller';
import { ActivitySectorsService } from './activity-sectors.service';
import { CreateActivitySectorDto } from './dto/create-activity-sector.dto';
import { UpdateActivitySectorDto } from './dto/update-activity-sector.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('ActivitySectorsController', () => {
    let controller: ActivitySectorsController;

    const activitySectorsServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActivitySectorsController],
            providers: [
                {
                    provide: ActivitySectorsService,
                    useValue: activitySectorsServiceMock,
                },
            ],
        }).compile();

        controller = module.get<ActivitySectorsController>(
            ActivitySectorsController,
        );

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create an activity sector', async () => {
            const dto = {
                activitySector: 'Informatique',
            } as CreateActivitySectorDto;

            const expectedResult = {
                id: 1,
                name: 'Informatique',
            };

            activitySectorsServiceMock.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(result).toEqual(expectedResult);

            expect(activitySectorsServiceMock.create).toHaveBeenCalledTimes(1);
            expect(activitySectorsServiceMock.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all activity sectors', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        name: 'Informatique',
                    },
                    {
                        id: 2,
                        name: 'Finance',
                    },
                ],
                total: 2,
                page: 1,
                pageSize: 20,
            };

            activitySectorsServiceMock.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(query);

            expect(result).toEqual(expectedResult);

            expect(activitySectorsServiceMock.findAll).toHaveBeenCalledTimes(1);
            expect(activitySectorsServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should pass the query unchanged to the service', async () => {
            const query = {
                page: 2,
                pageSize: 10,
            } as PaginationQueryDto;

            activitySectorsServiceMock.findAll.mockResolvedValue([]);

            await controller.findAll(query);

            expect(activitySectorsServiceMock.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findOne', () => {
        it('should return an activity sector by id', async () => {
            const id = 1;

            const expectedResult = {
                id,
                name: 'Informatique',
            };

            activitySectorsServiceMock.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(result).toEqual(expectedResult);

            expect(activitySectorsServiceMock.findOne).toHaveBeenCalledTimes(1);
            expect(activitySectorsServiceMock.findOne).toHaveBeenCalledWith(id);
        });

        it('should pass the id unchanged to the service', async () => {
            const id = 42;

            activitySectorsServiceMock.findOne.mockResolvedValue({
                id,
                name: 'Finance',
            });

            await controller.findOne(id);

            expect(activitySectorsServiceMock.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update an activity sector', async () => {
            const id = 1;

            const dto = {
                name: 'Informatique et numérique',
            } as UpdateActivitySectorDto;

            const expectedResult = {
                id,
                name: 'Informatique et numérique',
            };

            activitySectorsServiceMock.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, dto);

            expect(result).toEqual(expectedResult);

            expect(activitySectorsServiceMock.update).toHaveBeenCalledTimes(1);
            expect(activitySectorsServiceMock.update).toHaveBeenCalledWith(id, dto);
        });

        it('should pass both id and dto to the service', async () => {
            const id = 5;

            const dto = {
                activitySector: 'Santé',
            } as UpdateActivitySectorDto;

            activitySectorsServiceMock.update.mockResolvedValue({
                id,
                name: 'Santé',
            });

            await controller.update(id, dto);

            expect(activitySectorsServiceMock.update).toHaveBeenCalledWith(
                id,
                dto,
            );
        });
    });

    describe('remove', () => {
        it('should remove an activity sector', async () => {
            const id = 1;

            const expectedResult = {
                id,
                deleted: true,
            };

            activitySectorsServiceMock.remove.mockResolvedValue(expectedResult);

            const result = await controller.remove(id);

            expect(result).toEqual(expectedResult);

            expect(activitySectorsServiceMock.remove).toHaveBeenCalledTimes(1);
            expect(activitySectorsServiceMock.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('service errors', () => {
        it('should propagate create errors', async () => {
            const dto = {
                activitySector: 'Informatique',
            } as CreateActivitySectorDto;

            const error = new Error('Create failed');

            activitySectorsServiceMock.create.mockRejectedValue(error);

            await expect(controller.create(dto)).rejects.toThrow(error);

            expect(activitySectorsServiceMock.create).toHaveBeenCalledWith(dto);
        });

        it('should propagate findAll errors', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const error = new Error('Find all failed');

            activitySectorsServiceMock.findAll.mockRejectedValue(error);

            await expect(controller.findAll(query)).rejects.toThrow(error);

            expect(activitySectorsServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should propagate findOne errors', async () => {
            const error = new Error('Activity sector not found');

            activitySectorsServiceMock.findOne.mockRejectedValue(error);

            await expect(controller.findOne(999)).rejects.toThrow(error);

            expect(activitySectorsServiceMock.findOne).toHaveBeenCalledWith(999);
        });

        it('should propagate update errors', async () => {
            const dto = {
                name: 'Updated sector',
            } as UpdateActivitySectorDto;

            const error = new Error('Update failed');

            activitySectorsServiceMock.update.mockRejectedValue(error);

            await expect(controller.update(1, dto)).rejects.toThrow(error);

            expect(activitySectorsServiceMock.update).toHaveBeenCalledWith(
                1,
                dto,
            );
        });

        it('should propagate remove errors', async () => {
            const error = new Error('Delete failed');

            activitySectorsServiceMock.remove.mockRejectedValue(error);

            await expect(controller.remove(1)).rejects.toThrow(error);

            expect(activitySectorsServiceMock.remove).toHaveBeenCalledWith(1);
        });
    });
});
