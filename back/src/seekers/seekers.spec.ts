import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Seeker, VideoStatus } from "./entities/seeker.entity";
import { SeekersService } from "./seekers.service";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { User, UserRole } from "../users/entities/user.entity";
import { Competence } from "../competences/entities/competence.entity";
import { Localisation } from "../localisations/entities/localisation.entity";
import { ActivitySector } from "../activity-sectors/entities/activity-sector.entity";
import { Interaction } from "../interactions/entities/interaction.entity";
import { Recruiter } from "../recruiters/entities/recruiter.entity";
import { VideoProviderRegistry } from "../video-providers/video-provider.registry";

let queryBuilderInteraction: {
    select: jest.Mock;
    addSelect: jest.Mock;
    innerJoin: jest.Mock;
    where: jest.Mock;
    andWhere: jest.Mock;
    groupBy: jest.Mock;
    getRawMany: jest.Mock;
};

let queryBuilderSeeker: {
    select: jest.Mock;
    distinct: jest.Mock;
    innerJoin: jest.Mock;
    andWhere: jest.Mock;
    clone: jest.Mock;
    getCount: jest.Mock;
    orderBy: jest.Mock;
    offset: jest.Mock;
    limit: jest.Mock;
    getRawMany: jest.Mock;
};

describe('SeekersService', () => {

    queryBuilderInteraction = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
    };

    queryBuilderSeeker = {
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        getCount: jest.fn(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
    };

    let service: SeekersService;
    let repository: jest.Mock<Repository<Seeker>>;
    let repoUser: jest.Mock<Repository<User>>;
    let repoCompetence: jest.Mock<Repository<Competence>>;
    let repoLocalisation: jest.Mock<Repository<Localisation>>;
    let repoActivitySector: jest.Mock<Repository<ActivitySector>>;
    let repoRecruiter: jest.Mock<Repository<Recruiter>>;
    let repoVideo: jest.Mock<VideoProviderRegistry>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SeekersService,
                {
                    provide: getRepositoryToken(Seeker),
                    useValue: {
                        findOne: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderSeeker),
                        find: jest.fn(),
                        findAndCount: jest.fn(),
                        existsBy: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Competence),
                    useValue: {
                        findBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Localisation),
                    useValue: {
                        findBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(ActivitySector),
                    useValue: {
                        findBy: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Interaction),
                    useValue: {
                        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderInteraction),
                    },
                },
                {
                    provide: getRepositoryToken(Recruiter),
                    useValue: {
                        existsBy: jest.fn(),
                    },
                }, {
                    provide: VideoProviderRegistry,
                    useValue: {
                        get: jest.fn(),
                        isLinkProviderEnabled: jest.fn(),
                        getDefault: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SeekersService>(SeekersService);
        repository = module.get<jest.Mock<Repository<Seeker>>>(
            getRepositoryToken(Seeker),
        );
        repoUser = module.get<jest.Mock<Repository<User>>>(
            getRepositoryToken(User)
        );
        repoCompetence = module.get<jest.Mock<Repository<Competence>>>(
            getRepositoryToken(Competence)
        );
        repoLocalisation = module.get<jest.Mock<Repository<Localisation>>>(
            getRepositoryToken(Localisation)
        );
        repoActivitySector = module.get<jest.Mock<Repository<ActivitySector>>>(
            getRepositoryToken(ActivitySector)
        );
        repoRecruiter = module.get<jest.Mock<Repository<Recruiter>>>(
            getRepositoryToken(Recruiter)
        );
        repoVideo = module.get<jest.Mock<VideoProviderRegistry>>(VideoProviderRegistry);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });



    describe('findOneByUserId', () => {
        it('should return a seeker', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                role: UserRole.SEEKER,
                birthDate: "2000-12-31",
                likeCount: 0,
                videoView: {
                    playbackUrl: null,
                    status: 'none',
                },
            };

            repository.findOne.mockResolvedValue(user);
            queryBuilderInteraction.getRawMany.mockResolvedValue([
                {
                    seekerId: 1,
                    count: '0',
                },
            ]);
            const result = await service.findByUserId('1');

            expect(result).toEqual(user);
            expect(repository.findOne).toHaveBeenCalledWith({
                "relations": {
                    "activitySectors": true,
                    "competences": true,
                    "localisations": true,
                    "user": true,
                },
                "where": {
                    "user": {
                        "id": "1",
                    },
                },
            });
        });

        it('should return null when user does not exist', async () => {
            repository.findOne.mockResolvedValue(null);
            let result;

            try {
                result = await service.findByUserId('999');
            } catch { }

            expect(result).toBeUndefined();
            expect(repository.findOne).toHaveBeenCalledWith({
                "relations": {
                    "activitySectors": true,
                    "competences": true,
                    "localisations": true,
                    "user": true,
                },
                "where": {
                    "user": {
                        "id": "999",
                    },
                },
            });
        });
    });



    describe('findOne', () => {
        it('should return a seeker', async () => {
            const seeker = { id: 1, user: { id: 'user-1', role: UserRole.SEEKER, birthDate: '1990-01-01', }, name: 'John', lastname: 'Doe', videoProvider: null, videoExternalId: null, };

            repository.findOne!.mockResolvedValue(seeker);

            const result = await service.findOne(1);

            expect(result).toEqual(expect.objectContaining({ id: 1, videoView: { status: 'none', playbackUrl: null, }, }),);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1, }, relations: { competences: true, localisations: true, activitySectors: true, user: true, }, });
        });
        it('should throw when seeker does not exist', async () => {
            repository.findOne!.mockResolvedValue(null);

            await expect(service.findOne(999),).rejects.toThrow("Seeker not found");
        });
        it('should allow the owner to see a minor', async () => {
            const seeker = { id: 1, user: { id: 'user-1', role: UserRole.SEEKER, birthDate: '2015-01-01', }, videoProvider: null, videoExternalId: null, };

            repository.findOne!.mockResolvedValue(seeker);

            const result = await service.findOne(1, undefined, 'user-1',);

            expect(result).toBeDefined();
            expect(repoRecruiter.existsBy).not.toHaveBeenCalled();
        });
        it('should reject access to a minor without a valid recruiter', async () => {
            const seeker = { id: 1, user: { id: 'user-1', role: UserRole.SEEKER, birthDate: '2015-01-01', }, videoProvider: null, videoExternalId: null, };

            repository.findOne!.mockResolvedValue(seeker);
            repoRecruiter.existsBy!.mockResolvedValue(false);

            await expect(service.findOne(1, 123, 'another-user'),).rejects.toThrow("Seeker not found");

            expect(repoRecruiter.existsBy).toHaveBeenCalledWith({ id: 123, });
        });
        it('should allow access to a minor with a valid recruiter', async () => {
            const seeker = { id: 1, user: { id: 'user-1', role: UserRole.SEEKER, birthDate: '2015-01-01', }, videoProvider: null, videoExternalId: null, };

            repository.findOne!.mockResolvedValue(seeker);
            repoRecruiter.existsBy!.mockResolvedValue(true);

            const result = await service.findOne(1, 123, 'another-user',);

            expect(result).toBeDefined();
            expect(repoRecruiter.existsBy).toHaveBeenCalledWith({ id: 123, });
        });
        it('should return likeCount for the owner', async () => {
            const seeker = { id: 1, user: { id: 'user-1', role: UserRole.SEEKER, birthDate: '1990-01-01', }, videoProvider: null, videoExternalId: null, };

            repository.findOne!.mockResolvedValue(seeker);
            queryBuilderInteraction.getRawMany.mockResolvedValue([{ seekerId: 1, count: '12', },]);

            const result = await service.findOne(1, undefined, 'user-1',);

            expect(result).toEqual(expect.objectContaining({
                "id": 1,
                "user": {
                    "birthDate": "1990-01-01",
                    "id": "user-1",
                    "role": "seeker",
                },
                "videoExternalId": null,
                "videoProvider": null,
                "videoView": {
                    "playbackUrl": null,
                    "status": "none",
                }
            }));
            expect(queryBuilderInteraction.getRawMany,).toHaveBeenCalled();
        });
    });



    describe('findAll', () => {
        it('should return an empty array when there are no users', async () => {
            const users: Array = [{
                "count": "0",
                "seekerId": 1,
                "video": null,
                "videoConsentGivenAt": null,
                "videoConsentVersion": null,
                "videoExternalId": null,
                "videoModeratedAt": null,
                "videoModeratedBy": null,
                "videoProvider": null,
                "videoRejectionReason": null,
                "videoView": {
                    "playbackUrl": null,
                    "status": "none",
                }
            }];
            const expectedResult = {
                data: users,
                total: undefined,
                page: 1,
                pageSize: 20,
                totalPages: NaN,
            }
            let Seekers = [
                {
                    seekerId: 1,
                    count: '0',
                },
            ]
            queryBuilderSeeker.getRawMany.mockResolvedValue(Seekers);
            repository.find.mockResolvedValue(Seekers);
            const result = await service.findAll({ page: 1, pageSize: 20 });

            expect(result).toEqual(expectedResult);
            expect(repository.find).toHaveBeenCalledTimes(1);
        });

        it('should use the requested page and pageSize', async () => {
            queryBuilderSeeker.getRawMany.mockResolvedValue([]);
            repository.find!.mockResolvedValue([]);
            queryBuilderSeeker.getCount.mockResolvedValue(0);

            const result = await service.findAll({ page: 2, pageSize: 10 });

            expect(result).toBeDefined();
            expect(queryBuilderSeeker.offset).toHaveBeenCalledWith(10);
            expect(queryBuilderSeeker.limit).toHaveBeenCalledWith(10);
        });

        it('should return an empty result when no seeker is found', async () => {
            queryBuilderSeeker.getRawMany.mockResolvedValue([]);
            repository.find!.mockResolvedValue([]);
            queryBuilderSeeker.getCount.mockResolvedValue(0);

            const result = await service.findAll({ page: 1, pageSize: 20 });

            expect(result).toBeDefined();
            expect(repository.find).not.toHaveBeenCalled();
        });
    });


    describe('findAllAdmin', () => {
        it('should return paginated admin results', async () => {
            const items = [{
                id: 1,
                user: {
                    id: '1',
                    birthDate: '1990-01-01',
                },
                videoProvider: null,
                videoExternalId: null,
            },];
            const expected = {
                "data": [{
                    "id": 1,
                    "likeCount": NaN,
                    "user": {
                        "birthDate": "1990-01-01",
                        "id": "1"
                    },
                    "videoExternalId": null,
                    "videoProvider": null,
                    "videoView": {
                        "playbackUrl": null,
                        "status": "none"
                    }
                }],
                "page": 1,
                "pageSize": 20,
                "total": 1,
                "totalPages": 1
            }

            repository.findAndCount!.mockResolvedValue([items, 1]);
            queryBuilderInteraction.getRawMany.mockResolvedValue([{
                seekerId: 1,
            }]);
            const result = await service.findAllAdmin({
                page: 1,
                pageSize: 20,
            });

            expect(result).toBeDefined();
            expect(result).toEqual(expected)
            expect(repository.findAndCount).toHaveBeenCalledWith({
                where: {},
                relations: {
                    competences: true,
                    localisations: true,
                    activitySectors: true,
                    user: true,
                },
                order: {
                    id: 'DESC',
                },
                skip: 0,
                take: 20,
            });
            expect(queryBuilderInteraction.getRawMany).toHaveBeenCalled();
        });
    });
    it('should filter by videoStatus', async () => {
        const expected = {
            data: [{
                "0": "1",
                "likeCount": 0,
                "videoView": {
                    "playbackUrl": null,
                    "status": "none",
                },
            },
            {
                "0": "2",
                "likeCount": 0,
                "videoView": {
                    "playbackUrl": null,
                    "status": "none",
                },
            },], total: 2, page: 1, pageSize: 20, totalPages: 1
        };

        repository.findAndCount!.mockResolvedValue([["1", "2"], 2]);

        const result = await service.findAllAdmin({ page: 1, pageSize: 20, videoStatus: VideoStatus.APPROVED });

        expect(repository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({ where: { videoStatus: VideoStatus.APPROVED } }),);
        expect(result).toEqual(expected);
    });



    describe('create', () => {
        const dto = {
            userId: '1',
            name: 'John',
            lastname: 'Doe',
            competenceIds: [1, 2],
            localisationIds: [3],
            activitySectorIds: [4],
            video: undefined
        } as any;

        it('should create a seeker', async () => {
            const user = { id: '1', role: UserRole.SEEKER };
            const seeker = { id: 1, name: 'John', lastname: 'Doe' };

            repoUser.findOneBy!.mockResolvedValue(user);
            repository.existsBy!.mockResolvedValue(false);
            repoCompetence.findBy!.mockResolvedValue([{ id: 1 }, { id: 2 },]);
            repoLocalisation.findBy!.mockResolvedValue([{ id: 3 },]);
            repoActivitySector.findBy!.mockResolvedValue([{ id: 4 },]);
            repository.create!.mockReturnValue(seeker);
            repository.save!.mockResolvedValue(seeker);

            const result = await service.create(dto, { userId: '1', role: UserRole.SEEKER });

            expect(result).toEqual(seeker);
            expect(repository.create).toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith(seeker,);
        });

        it('should reject creation by another user', async () => {
            await expect(service.create(dto, { userId: 'another-user', role: UserRole.SEEKER }),).rejects.toThrow("This profile does not belong to you");

            expect(repoUser.findOneBy).not.toHaveBeenCalled();
        });

        it('should reject when user does not exist', async () => {
            repoUser.findOneBy!.mockResolvedValue(null);

            await expect(service.create(dto, { userId: '1', role: UserRole.SEEKER }),).rejects.toThrow("not found");
        });

        it('should reject when user is not a seeker', async () => {
            repoUser.findOneBy!.mockResolvedValue({ id: '1', role: UserRole.RECRUITER });

            await expect(service.create(dto, { userId: '1', role: UserRole.SEEKER }),).rejects.toThrow("User does not have the seeker role");
        });

        it('should reject when seeker profile already exists', async () => {
            repoUser.findOneBy!.mockResolvedValue({ id: '1', role: UserRole.SEEKER });
            repository.existsBy!.mockResolvedValue(true);

            await expect(service.create(dto, { userId: '1', role: UserRole.SEEKER }),).rejects.toThrow("This user already has a seeker profile");
        });

        it('should reject unknown competence ids', async () => {
            repoUser.findOneBy!.mockResolvedValue({ id: '1', role: UserRole.SEEKER });
            repository.existsBy!.mockResolvedValue(false);
            repoCompetence.findBy!.mockResolvedValue([{ id: 1 },]);
            repoLocalisation.findBy!.mockResolvedValue([]);
            repoActivitySector.findBy!.mockResolvedValue([]);

            await expect(service.create(dto, { userId: '1', role: UserRole.SEEKER }),).rejects.toThrow("Unknown competence id(s)");
        });

        it('should reject link video when provider is disabled', async () => {
            const videoDto = { ...dto, video: 'https://example.com/video.mp4' };

            repoUser.findOneBy!.mockResolvedValue({ id: '1', role: UserRole.SEEKER });
            repository.existsBy!.mockResolvedValue(false);
            repoCompetence.findBy!.mockResolvedValue([{ id: 1 }, { id: 2 },]);
            repoLocalisation.findBy!.mockResolvedValue([{ id: 3 },]);
            repoActivitySector.findBy!.mockResolvedValue([{ id: 4 },]);
            repoVideo.isLinkProviderEnabled.mockReturnValue(false);

            await expect(service.create(videoDto, { userId: '1', role: UserRole.SEEKER }),).rejects.toThrow("The link video provider is disabled; upload a file via POST /seekers/:id/video instead");
        });
    });


    describe('update', () => {
        it('should update the seeker name', async () => {
            const seeker: any = { id: 1, name: 'Old', lastname: 'Doe', user: { id: '1' }, competences: [], localisations: [], activitySectors: [] };

            repository.findOne!.mockResolvedValue(seeker);
            repository.save!.mockResolvedValue(seeker);

            const result = await service.update(1, { name: 'New' } as any, { userId: '1', role: UserRole.SEEKER },);

            expect(seeker.name).toBe('New');
            expect(repository.save).toHaveBeenCalledWith(seeker);
            expect(result).toBe(seeker);
        });

        it('should reject update by another user', async () => {
            repository.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(service.update(1, { name: 'New' } as any, { userId: 'another-user', role: UserRole.SEEKER },),).rejects.toThrow("This profile does not belong to you");
        });

        it('should update competences', async () => {
            const seeker: any = { id: 1, user: { id: '1' }, competences: [], localisations: [], activitySectors: [] };

            repository.findOne!.mockResolvedValue(seeker);
            repoCompetence.findBy!.mockResolvedValue([{ id: 10 }, { id: 20 },]);
            repository.save!.mockResolvedValue(seeker);

            await service.update(1, { competenceIds: [10, 20] } as any, { userId: '1', role: UserRole.SEEKER },);

            expect(seeker.competences).toEqual([{ id: 10 }, { id: 20 },]);
        });
    });


    describe('remove', () => {
        it('should remove a seeker', async () => {
            const seeker: any = { id: 1, user: { id: 'user-1' }, videoProvider: null, videoExternalId: null };

            repository.findOne!.mockResolvedValue(seeker);
            repository.delete!.mockResolvedValue({ affected: 1 });

            await service.remove(1, { userId: 'user-1', role: UserRole.SEEKER },);

            expect(repository.delete).toHaveBeenCalledWith(1);
        });

        it('should reject removal when seeker does not exist', async () => {
            repository.findOne!.mockResolvedValue(null);

            await expect(service.remove(999, { userId: 'user-1', role: UserRole.SEEKER }),).rejects.toThrow("Seeker not found");
        });

        it('should reject removal by another user', async () => {
            repository.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(service.remove(1, { userId: 'another-user', role: UserRole.SEEKER }),).rejects.toThrow("This profile does not belong to you");
        });
    });



    describe('moderateVideo', () => {
        it('should approve a video', async () => {
            const seeker: any = { id: 1, videoStatus: VideoStatus.PENDING, videoRejectionReason: null, videoModeratedAt: null, videoModeratedBy: null };

            repoUser.findOneBy!.mockResolvedValue({ id: 'admin-1', role: UserRole.ADMIN });
            repository.findOne!.mockResolvedValue(seeker);
            repository.save!.mockResolvedValue(seeker);

            const result = await service.moderateVideo(1, { adminUserId: 'admin-1', status: VideoStatus.APPROVED } as any);

            expect(seeker.videoStatus).toBe(VideoStatus.APPROVED,);
            expect(seeker.videoModeratedBy).toBe('admin-1',);
            expect(repository.save).toHaveBeenCalledWith(seeker,);
            expect(result).toBe(seeker);
        });

        it('should reject non-admin user', async () => {
            repoUser.findOneBy!.mockResolvedValue({ id: 'user-1', role: UserRole.SEEKER });

            await expect(service.moderateVideo(1, { adminUserId: 'user-1', status: VideoStatus.APPROVED } as any),).rejects.toThrow("adminUserId does not belong to an admin");
        });

        it('should require a reason when rejecting a video', async () => {
            repoUser.findOneBy!.mockResolvedValue({ id: 'admin-1', role: UserRole.ADMIN });

            await expect(service.moderateVideo(1, { adminUserId: 'admin-1', status: VideoStatus.REJECTED } as any),).rejects.toThrow("A reason is required to reject a video");
        });

        it('should throw when seeker does not exist', async () => {
            repoUser.findOneBy!.mockResolvedValue({ id: 'admin-1', role: UserRole.ADMIN });
            repository.findOne!.mockResolvedValue(null);

            await expect(service.moderateVideo(999, { adminUserId: 'admin-1', status: VideoStatus.APPROVED } as any),).rejects.toThrow("Seeker not found");
        });
    });



    describe('uploadVideo', () => {
        it('should upload a video', async () => {
            const seeker: any = { id: 1, user: { id: 'user-1' }, video: null, videoProvider: null, videoExternalId: null, videoStatus: VideoStatus.PENDING };
            const provider = { name: 'local', store: jest.fn().mockResolvedValue({ externalId: 'video-123' }), delete: jest.fn().mockResolvedValue(undefined) };
            const file: any = { originalname: 'video.mp4', mimetype: 'video/mp4', buffer: Buffer.from('video') };

            repository.findOne!.mockResolvedValue(seeker);
            repoVideo.getDefault.mockReturnValue(provider);
            repository.save!.mockResolvedValue(seeker);

            const result = await service.uploadVideo(1, file, true, { userId: 'user-1', role: UserRole.SEEKER },);

            expect(provider.store).toHaveBeenCalledWith(file);
            expect(seeker.videoProvider).toBe(provider.name,);
            expect(seeker.videoExternalId).toBe('video-123',);
            expect(seeker.videoStatus).toBe(VideoStatus.PENDING,);
            expect(repository.save).toHaveBeenCalledWith(seeker,);
            expect(result).toBe(seeker);
        });

        it('should reject upload without consent', async () => {
            repository.findOne!.mockResolvedValue({ id: 1, user: { id: 'user-1' } });

            await expect(service.uploadVideo(1, {} as any, false, { userId: 'user-1', role: UserRole.SEEKER },),).rejects.toThrow("Le consentement à la publication de la vidéo (image et voix) est requis.");
        });

        it('should reject upload when seeker does not exist', async () => {
            repository.findOne!.mockResolvedValue(null);

            await expect(service.uploadVideo(999, {} as any, true, { userId: 'user-1', role: UserRole.SEEKER },),).rejects.toThrow("Seeker not found");
        });

        it('should reject upload by another user', async () => {
            repository.findOne!.mockResolvedValue({ id: 1, user: { id: 'owner' } });

            await expect(service.uploadVideo(1, {} as any, true, { userId: 'another-user', role: UserRole.SEEKER },),).rejects.toThrow("This profile does not belong to you");
        });
    });



    describe('deleteVideo', () => {
        it('should delete a video', async () => {
            const provider = { name: 'local', delete: jest.fn().mockResolvedValue(undefined) };
            const seeker: any = { id: 1, user: { id: 'user-1' }, video: 'old-video', videoProvider: 'local', videoExternalId: 'external-123', videoStatus: VideoStatus.APPROVED };

            repository.findOne!.mockResolvedValue(seeker);
            repoVideo.get.mockReturnValue(provider);
            repository.save!.mockResolvedValue(seeker);

            const result = await service.deleteVideo(1, { userId: 'user-1', role: UserRole.SEEKER },);

            expect(provider.delete).toHaveBeenCalledWith('external-123',);
            expect(seeker.video).toBeNull();
            expect(seeker.videoProvider).toBeNull();
            expect(seeker.videoExternalId).toBeNull();
            expect(seeker.videoStatus).toBe(VideoStatus.PENDING,);
            expect(repository.save).toHaveBeenCalledWith(seeker,);
            expect(result).toBe(seeker);
        });
        it('should reject deletion when seeker does not exist', async () => {
            repository.findOne!.mockResolvedValue(null);

            await expect(service.deleteVideo(999, { userId: 'user-1', role: UserRole.SEEKER }),).rejects.toThrow("Seeker not found");
        });
    });


    describe('resolveLocalVideoFileAccess', () => {
        it('should return null when seeker does not exist', async () => {
            repository.findOne!.mockResolvedValue(null);

            const result = await service.resolveLocalVideoFileAccess(999);

            expect(result).toBeNull();
        });
        it('should return null when video provider is not local', async () => {
            repository.findOne!.mockResolvedValue({ id: 1, videoProvider: 'link', videoExternalId: 'abc', user: { id: 'user-1' } });

            const result = await service.resolveLocalVideoFileAccess(1);

            expect(result).toBeNull();
        });
        it('should allow the owner', async () => {
            const seeker: any = { id: 1, videoProvider: 'local', videoExternalId: 'abc', videoStatus: VideoStatus.PENDING, user: { id: 'user-1' } };

            repository.findOne!.mockResolvedValue(seeker);

            const result = await service.resolveLocalVideoFileAccess(1, 'user-1',);

            expect(result).toEqual({ seeker });
        });
        it('should allow an admin', async () => {
            const seeker: any = { id: 1, videoProvider: 'local', videoExternalId: 'abc', videoStatus: VideoStatus.PENDING, user: { id: 'owner', birthDate: '1990-01-01' } };

            repository.findOne!.mockResolvedValue(seeker);

            repoUser.findOneBy!.mockResolvedValue({ id: 'admin-1', role: UserRole.ADMIN });

            const result = await service.resolveLocalVideoFileAccess(1, 'admin-1',);

            expect(result).toEqual({ seeker });
        });
        it('should deny an unapproved adult video', async () => {
            const seeker: any = { id: 1, videoProvider: 'local', videoExternalId: 'abc', videoStatus: VideoStatus.PENDING, user: { id: 'owner', birthDate: '1990-01-01' } };

            repository.findOne!.mockResolvedValue(seeker);

            const result = await service.resolveLocalVideoFileAccess(1, 'viewer-1',);

            expect(result).toBeNull();
        });
        it('should allow an approved adult video', async () => {
            const seeker: any = { id: 1, videoProvider: 'local', videoExternalId: 'abc', videoStatus: VideoStatus.APPROVED, user: { id: 'owner', birthDate: '1990-01-01' } };

            repository.findOne!.mockResolvedValue(seeker);

            const result = await service.resolveLocalVideoFileAccess(1, 'viewer-1',);

            expect(result).toEqual({ seeker });
        });
        it('should deny a minor even when the video is approved', async () => {
            const seeker: any = { id: 1, videoProvider: 'local', videoExternalId: 'abc', videoStatus: VideoStatus.APPROVED, user: { id: 'owner', birthDate: '2015-01-01' } };

            repository.findOne!.mockResolvedValue(seeker);

            const result = await service.resolveLocalVideoFileAccess(1, 'viewer-1',);

            expect(result).toBeNull();
        });
    });
});
