import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { InteractionsService } from './interactions.service';
import { Interaction } from './entities/interaction.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Seeker } from '../seekers/entities/seeker.entity';
import { UserRole } from '../users/entities/user.entity';

describe('InteractionsService authorization', () => {
    let service: InteractionsService;
    let repoInteraction: jest.Mock<Repository<Interaction>>;
    let repoSeeker: jest.Mock<Repository<Seeker>>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                InteractionsService,
                {
                    provide: getRepositoryToken(Interaction),
                    useValue: {
                        findAndCount: jest.fn(),
                        countBy: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Recruiter),
                    useValue: { findOneBy: jest.fn() },
                },
                {
                    provide: getRepositoryToken(Seeker),
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get(InteractionsService);
        repoInteraction = module.get(getRepositoryToken(Interaction));
        repoSeeker = module.get(getRepositoryToken(Seeker));
    });

    describe('findReceived', () => {
        it('should reject a caller who does not own the seeker profile', async () => {
            repoSeeker.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(
                service.findReceived(1, {}, { userId: 'another-user', role: UserRole.SEEKER }),
            ).rejects.toThrow('This profile does not belong to you');

            expect(repoInteraction.findAndCount).not.toHaveBeenCalled();
        });

        it('should reject when the seeker does not exist', async () => {
            repoSeeker.findOne!.mockResolvedValue(null);

            await expect(
                service.findReceived(999, {}, { userId: 'anyone', role: UserRole.SEEKER }),
            ).rejects.toThrow('This profile does not belong to you');
        });

        it('should allow the owner', async () => {
            repoSeeker.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });
            repoInteraction.findAndCount!.mockResolvedValue([[], 0]);

            await expect(
                service.findReceived(1, {}, { userId: 'owner', role: UserRole.SEEKER }),
            ).resolves.toBeDefined();
        });

        it('should allow an admin regardless of ownership', async () => {
            repoInteraction.findAndCount!.mockResolvedValue([[], 0]);

            await expect(
                service.findReceived(1, {}, { userId: 'someone-else', role: UserRole.ADMIN }),
            ).resolves.toBeDefined();

            expect(repoSeeker.findOne).not.toHaveBeenCalled();
        });
    });

    describe('countUnread', () => {
        it('should reject a caller who does not own the seeker profile', async () => {
            repoSeeker.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(
                service.countUnread(1, { userId: 'another-user', role: UserRole.SEEKER }),
            ).rejects.toThrow('This profile does not belong to you');
        });
    });

    describe('markAllSeen', () => {
        it('should reject a caller who does not own the seeker profile', async () => {
            repoSeeker.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(
                service.markAllSeen(1, { userId: 'another-user', role: UserRole.SEEKER }),
            ).rejects.toThrow('This profile does not belong to you');

            expect(repoInteraction.update).not.toHaveBeenCalled();
        });
    });

    describe('markSeen', () => {
        it('should reject a caller who does not own the seeker profile', async () => {
            repoSeeker.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(
                service.markSeen(1, 1, { userId: 'another-user', role: UserRole.SEEKER }),
            ).rejects.toThrow('This profile does not belong to you');

            expect(repoInteraction.findOne).not.toHaveBeenCalled();
        });
    });
});
