import { Test, TestingModule } from '@nestjs/testing';
import { LocalisationsController } from './localisations.controller';
import { LocalisationsService } from './localisations.service';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('LocalisationsController', () => {
    let controller: LocalisationsController;

    const localisationsServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocalisationsController],
            providers: [
                {
                    provide: LocalisationsService,
                    useValue: localisationsServiceMock,
                },
            ],
        }).compile();

        controller = module.get<LocalisationsController>(
            LocalisationsController,
        );

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a localisation', async () => {
            const dto = {
                localisation: 'Paris',
            } as CreateLocalisationDto;

            const expectedResult = {
                id: 1,
                city: 'Paris',
                country: 'France',
            };

            localisationsServiceMock.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(result).toEqual(expectedResult);

            expect(localisationsServiceMock.create).toHaveBeenCalledTimes(1);
            expect(localisationsServiceMock.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all localisations', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        city: 'Paris',
                        country: 'France',
                    },
                    {
                        id: 2,
                        city: 'Lyon',
                        country: 'France',
                    },
                ],
                total: 2,
                page: 1,
                pageSize: 20,
            };

            localisationsServiceMock.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(query);

            expect(result).toEqual(expectedResult);

            expect(localisationsServiceMock.findAll).toHaveBeenCalledTimes(1);
            expect(localisationsServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should pass the query unchanged to the service', async () => {
            const query = {
                page: 2,
                pageSize: 10,
            } as PaginationQueryDto;

            localisationsServiceMock.findAll.mockResolvedValue([]);

            await controller.findAll(query);

            expect(localisationsServiceMock.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findOne', () => {
        it('should return a localisation by id', async () => {
            const id = 1;

            const expectedResult = {
                id,
                city: 'Paris',
                country: 'France',
            };

            localisationsServiceMock.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(result).toEqual(expectedResult);

            expect(localisationsServiceMock.findOne).toHaveBeenCalledTimes(1);
            expect(localisationsServiceMock.findOne).toHaveBeenCalledWith(id);
        });

        it('should pass the id unchanged to the service', async () => {
            const id = 42;

            localisationsServiceMock.findOne.mockResolvedValue({
                id,
                city: 'Lyon',
                country: 'France',
            });

            await controller.findOne(id);

            expect(localisationsServiceMock.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update a localisation', async () => {
            const id = 1;

            const dto = {
                city: 'Marseille',
                country: 'France',
            } as UpdateLocalisationDto;

            const expectedResult = {
                id,
                city: 'Marseille',
                country: 'France',
            };

            localisationsServiceMock.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, dto);

            expect(result).toEqual(expectedResult);

            expect(localisationsServiceMock.update).toHaveBeenCalledTimes(1);
            expect(localisationsServiceMock.update).toHaveBeenCalledWith(id, dto);
        });

        it('should pass both id and dto to the service', async () => {
            const id = 5;

            const dto = {
                city: 'Bordeaux',
                country: 'France',
            } as UpdateLocalisationDto;

            localisationsServiceMock.update.mockResolvedValue({
                id,
                ...dto,
            });

            await controller.update(id, dto);

            expect(localisationsServiceMock.update).toHaveBeenCalledWith(
                id,
                dto,
            );
        });
    });

    describe('remove', () => {
        it('should remove a localisation', async () => {
            const id = 1;

            const expectedResult = {
                id,
                deleted: true,
            };

            localisationsServiceMock.remove.mockResolvedValue(expectedResult);

            const result = await controller.remove(id);

            expect(result).toEqual(expectedResult);

            expect(localisationsServiceMock.remove).toHaveBeenCalledTimes(1);
            expect(localisationsServiceMock.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('service errors', () => {
        it('should propagate create errors', async () => {
            const dto = {
                localisation: 'Paris',
            } as CreateLocalisationDto;

            const error = new Error('Create failed');

            localisationsServiceMock.create.mockRejectedValue(error);

            await expect(controller.create(dto)).rejects.toThrow(error);

            expect(localisationsServiceMock.create).toHaveBeenCalledWith(dto);
        });

        it('should propagate findAll errors', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const error = new Error('Find all failed');

            localisationsServiceMock.findAll.mockRejectedValue(error);

            await expect(controller.findAll(query)).rejects.toThrow(error);

            expect(localisationsServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should propagate findOne errors', async () => {
            const error = new Error('Localisation not found');

            localisationsServiceMock.findOne.mockRejectedValue(error);

            await expect(controller.findOne(999)).rejects.toThrow(error);

            expect(localisationsServiceMock.findOne).toHaveBeenCalledWith(999);
        });

        it('should propagate update errors', async () => {
            const dto = {
                city: 'Paris',
                country: 'France',
            } as UpdateLocalisationDto;

            const error = new Error('Update failed');

            localisationsServiceMock.update.mockRejectedValue(error);

            await expect(controller.update(1, dto)).rejects.toThrow(error);

            expect(localisationsServiceMock.update).toHaveBeenCalledWith(
                1,
                dto,
            );
        });

        it('should propagate remove errors', async () => {
            const error = new Error('Delete failed');

            localisationsServiceMock.remove.mockRejectedValue(error);

            await expect(controller.remove(1)).rejects.toThrow(error);

            expect(localisationsServiceMock.remove).toHaveBeenCalledWith(1);
        });
    });
});
