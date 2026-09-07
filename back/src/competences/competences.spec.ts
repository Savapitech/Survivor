import { Test, TestingModule } from '@nestjs/testing';
import { CompetencesController } from './competences.controller';
import { CompetencesService } from './competences.service';
import { CreateCompetenceDto } from './dto/create-competence.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

describe('CompetencesController', () => {
    let controller: CompetencesController;

    const competencesServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompetencesController],
            providers: [
                {
                    provide: CompetencesService,
                    useValue: competencesServiceMock,
                },
            ],
        }).compile();

        controller = module.get<CompetencesController>(CompetencesController);

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a competence', async () => {
            const dto = {
                name: 'JavaScript',
            } as unknown as CreateCompetenceDto;

            const expectedResult = {
                id: 1,
                name: 'JavaScript',
            };

            competencesServiceMock.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(result).toEqual(expectedResult);
            expect(competencesServiceMock.create).toHaveBeenCalledTimes(1);
            expect(competencesServiceMock.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all competences', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        name: 'JavaScript',
                    },
                    {
                        id: 2,
                        name: 'TypeScript',
                    },
                ],
                total: 2,
                page: 1,
                pageSize: 20,
            };

            competencesServiceMock.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(query);

            expect(result).toEqual(expectedResult);
            expect(competencesServiceMock.findAll).toHaveBeenCalledTimes(1);
            expect(competencesServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should pass the query unchanged to the service', async () => {
            const query = {
                page: 2,
                pageSize: 10,
            } as PaginationQueryDto;

            competencesServiceMock.findAll.mockResolvedValue([]);

            await controller.findAll(query);

            expect(competencesServiceMock.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findOne', () => {
        it('should return a competence by id', async () => {
            const id = 1;

            const expectedResult = {
                id,
                name: 'JavaScript',
            };

            competencesServiceMock.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(result).toEqual(expectedResult);
            expect(competencesServiceMock.findOne).toHaveBeenCalledTimes(1);
            expect(competencesServiceMock.findOne).toHaveBeenCalledWith(id);
        });

        it('should pass the id unchanged to the service', async () => {
            const id = 42;

            competencesServiceMock.findOne.mockResolvedValue({
                id,
                name: 'TypeScript',
            });

            await controller.findOne(id);

            expect(competencesServiceMock.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update a competence', async () => {
            const id = 1;

            const dto = {
                name: 'JavaScript avancé',
            } as UpdateCompetenceDto;

            const expectedResult = {
                id,
                name: 'JavaScript avancé',
            };

            competencesServiceMock.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, dto);

            expect(result).toEqual(expectedResult);
            expect(competencesServiceMock.update).toHaveBeenCalledTimes(1);
            expect(competencesServiceMock.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('remove', () => {
        it('should remove a competence', async () => {
            const id = 1;

            const expectedResult = {
                id,
                deleted: true,
            };

            competencesServiceMock.remove.mockResolvedValue(expectedResult);

            const result = await controller.remove(id);

            expect(result).toEqual(expectedResult);
            expect(competencesServiceMock.remove).toHaveBeenCalledTimes(1);
            expect(competencesServiceMock.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('service errors', () => {
        it('should propagate create errors', async () => {
            const dto = {
                name: 'JavaScript',
            } as unknown as CreateCompetenceDto;

            const error = new Error('Create failed');

            competencesServiceMock.create.mockRejectedValue(error);

            await expect(controller.create(dto)).rejects.toThrow(error);

            expect(competencesServiceMock.create).toHaveBeenCalledWith(dto);
        });

        it('should propagate findAll errors', async () => {
            const query = {
                page: 1,
                pageSize: 20,
            } as PaginationQueryDto;

            const error = new Error('Find all failed');

            competencesServiceMock.findAll.mockRejectedValue(error);

            await expect(controller.findAll(query)).rejects.toThrow(error);

            expect(competencesServiceMock.findAll).toHaveBeenCalledWith(query);
        });

        it('should propagate findOne errors', async () => {
            const error = new Error('Competence not found');

            competencesServiceMock.findOne.mockRejectedValue(error);

            await expect(controller.findOne(999)).rejects.toThrow(error);

            expect(competencesServiceMock.findOne).toHaveBeenCalledWith(999);
        });

        it('should propagate update errors', async () => {
            const dto = {
                name: 'Updated competence',
            } as UpdateCompetenceDto;

            const error = new Error('Update failed');

            competencesServiceMock.update.mockRejectedValue(error);

            await expect(controller.update(1, dto)).rejects.toThrow(error);

            expect(competencesServiceMock.update).toHaveBeenCalledWith(1, dto);
        });

        it('should propagate remove errors', async () => {
            const error = new Error('Delete failed');

            competencesServiceMock.remove.mockRejectedValue(error);

            await expect(controller.remove(1)).rejects.toThrow(error);

            expect(competencesServiceMock.remove).toHaveBeenCalledWith(1);
        });
    });
});
