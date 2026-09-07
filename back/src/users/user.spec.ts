import { getRepositoryToken } from "@nestjs/typeorm";
import { User, UserRole } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";

describe('UsersService', () => {
    let service: UsersService;
    let repository: jest.Mock<Repository<User>>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                        findAndCount: jest.fn(),
                        update: jest.fn(),
                        existsBy: jest.fn(),
                        remove: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<jest.Mock<Repository<User>>>(
            getRepositoryToken(User),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findOne', () => {
        it('should return a user', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                role: UserRole.SEEKER,
                birthDate: "2000-12-31",
            };

            repository.findOneBy.mockResolvedValue(user);

            const result = await service.findOne('1');

            expect(result).toEqual(user);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
        });

        it('should return null when user does not exist', async () => {
            repository.findOneBy.mockResolvedValue(null);
            let result;

            try {
                result = await service.findOne(999);
            } catch { }

            expect(result).toBeUndefined();
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const users = [
                { id: 1, email: 'test1@example.com', role: UserRole.SEEKER, birthDate: "2000-12-31", },
                { id: 2, email: 'test2@example.com', role: UserRole.SEEKER, birthDate: "2000-12-31", },
            ];
            const expectedResult = {
                data: users,
                total: 2,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            }
            repository.findAndCount.mockResolvedValue([users, 2]);

            const result = await service.findAll({ page: 1, pageSize: 20 });

            expect(result).toEqual(expectedResult);
            expect(repository.findAndCount).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array when there are no users', async () => {
            repository.findAndCount.mockResolvedValue([[], 0]);

            const result = await service.findAll({ page: 1, pageSize: 20 });

            expect(result).toEqual({ "data": [], "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 });
        });
    });

    describe('create', () => {
        it('should create and return a user', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                role: UserRole.SEEKER,
                birthDate: "2000-12-31"
            };

            repository.save.mockResolvedValue(user);

            const result = await service.create({
                email: 'test@example.com',
                password: '12345678',
                role: UserRole.SEEKER,
                birthDate: "2000-12-31",
            });

            expect(result).toEqual(user);
            expect(repository.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: expect.any(String),
                role: UserRole.SEEKER,
                birthDate: "2000-12-31",
            });

            const createArgument = repository.create.mock.calls[0][0];
            expect(createArgument.password).not.toBe('12345678');
            expect(createArgument.password).toMatch(/^\$2[aby]\$\d{2}\$/);
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');

            repository.save.mockRejectedValue(error);

            await expect(
                service.create({
                    email: 'test@example.com',
                    password: "12345678",
                    birthDate: "2000-12-31",
                    role: UserRole.SEEKER
                }),
            ).rejects.toThrow('Database error');
        });
    });



    describe('update', () => {
        it('update a user', async () => {
            const user = {
                email: 'test@example.com',
                role: UserRole.SEEKER,
                password: '12345678',
                birthDate: '2000-12-31'
            };
            const resultUser = {
                email: 'tet@example.com',
                role: UserRole.SEEKER,
                password: '12345678',
                birthDate: '2000-12-30'
            };
            repository.update.mockResolvedValue({
                email: 'test@example.com',
                password: expect.any(String),
                role: UserRole.SEEKER,
                birthDate: "2000-12-31",
            });

            repository.findOneBy.mockResolvedValue(user);
            repository.existsBy.mockResolvedValue(false);

            const result = await service.update('1', { email: 'tet@example.com', password: '12345678', birthDate: '2000-12-30'}, {userId:'1', role: UserRole.SEEKER});

            expect(result).not.toEqual(user);
            expect(repository.update).toHaveBeenCalled();
            expect(repository.update).toHaveBeenCalledWith('1', { email: 'tet@example.com', password: expect.any(String), birthDate: '2000-12-30'});
        });
    });



    describe('remove', () => {
        it('should delete a user', async () => {
            repository.delete.mockResolvedValue({
                affected: 1,
            });

            const result = await service.remove('1', { userId: '1', role: UserRole.SEEKER });

            expect(result).toEqual(undefined);

            expect(repository.delete).toHaveBeenCalledWith('1');
        });

        it('should delete a user by an admin', async () => {
            repository.delete.mockResolvedValue({
                affected: 1,
            });

            const result = await service.remove('1', { userId: '30', role: UserRole.ADMIN });

            expect(result).toEqual(undefined);

            expect(repository.delete).toHaveBeenCalledWith('1');
        });

        it("shouldn't delete the user", async () => {
            repository.delete.mockResolvedValue({
                affected: 1,
            });

            await expect(service.remove('1', { userId: '30', role: UserRole.SEEKER })).rejects.toThrow('This account does not belong to you');

            expect(repository.delete).not.toHaveBeenCalled();
        });

        it('should handle a user that does not exist', async () => {
            repository.delete.mockResolvedValue({
                affected: 0,
            });

            await expect(
                service.remove('999', { userId: '1', role: UserRole.ADMIN })
            ).rejects.toThrow("User not found")

            expect(repository.delete).toHaveBeenCalledWith('999');
        });
    });
});
