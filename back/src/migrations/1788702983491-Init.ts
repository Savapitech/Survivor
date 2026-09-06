import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1788702983491 implements MigrationInterface {
    name = 'Init1788702983491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'seeker', 'recruiter')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "birthDate" date NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "localisation" ("id" SERIAL NOT NULL, "localisation" character varying NOT NULL, CONSTRAINT "UQ_7adf5a424601021fd48dfc9f732" UNIQUE ("localisation"), CONSTRAINT "PK_296b44eea08ff6807f4430650dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competence" ("id" SERIAL NOT NULL, "competence" character varying NOT NULL, CONSTRAINT "UQ_4822e533d67e697686158841915" UNIQUE ("competence"), CONSTRAINT "PK_994109fe84a82508e174282df03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seeker_videostatus_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "seeker" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "certification" boolean NOT NULL DEFAULT false, "video" character varying, "videoProvider" character varying, "videoExternalId" character varying, "videoStatus" "public"."seeker_videostatus_enum" NOT NULL DEFAULT 'pending', "videoRejectionReason" text, "videoModeratedAt" TIMESTAMP, "videoModeratedBy" uuid, "videoConsentGivenAt" TIMESTAMP, "videoConsentVersion" character varying, "userId" uuid, CONSTRAINT "REL_20bb01672b489f23ffb33c07ca" UNIQUE ("userId"), CONSTRAINT "PK_40c70b62e7b0087bdd3f383ed3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_sector" ("id" SERIAL NOT NULL, "activitySector" character varying NOT NULL, CONSTRAINT "UQ_6a3cd68b31260d18cb795aea6cd" UNIQUE ("activitySector"), CONSTRAINT "PK_77933457dfcb2f851c75a36a370" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recruiter" ("id" SERIAL NOT NULL, "companyName" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_a6593fa02ecf157f2161490527" UNIQUE ("userId"), CONSTRAINT "PK_e10c71ef86a9be2a6aead8eadfa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."interaction_type_enum" AS ENUM('view', 'contact', 'favorite', 'like')`);
        await queryRunner.query(`CREATE TABLE "interaction" ("id" SERIAL NOT NULL, "type" "public"."interaction_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "seenAt" TIMESTAMP, "recruiterId" integer, "seekerId" integer, CONSTRAINT "PK_9204371ccb2c9dab5428b406413" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."message_senderrole_enum" AS ENUM('seeker', 'recruiter')`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "senderRole" "public"."message_senderrole_enum" NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "seenAt" TIMESTAMP, "recruiterId" integer, "seekerId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attempt" ("id" SERIAL NOT NULL, "questionIds" integer array NOT NULL DEFAULT '{}', "score" double precision, "submittedAt" TIMESTAMP, "seekerId" integer, CONSTRAINT "REL_8b8b24e4c2628a54eb63aa4993" UNIQUE ("seekerId"), CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, "weight" double precision NOT NULL DEFAULT '1', "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "value" double precision NOT NULL, "attemptId" integer, "questionId" integer, CONSTRAINT "UQ_2bb018677c5d400e8182c5a5c55" UNIQUE ("attemptId", "questionId"), CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seeker_localisations_localisation" ("seekerId" integer NOT NULL, "localisationId" integer NOT NULL, CONSTRAINT "PK_f5273b9bd9b1f79cdfa46aea74b" PRIMARY KEY ("seekerId", "localisationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1883505acd057fe532500c4e76" ON "seeker_localisations_localisation"  ("seekerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_341fdf829b5cc9e1959da6114f" ON "seeker_localisations_localisation"  ("localisationId") `);
        await queryRunner.query(`CREATE TABLE "seeker_competences_competence" ("seekerId" integer NOT NULL, "competenceId" integer NOT NULL, CONSTRAINT "PK_ebc6582f8f44686f4001aabc9f0" PRIMARY KEY ("seekerId", "competenceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f0aa557ac1cfff3fd8704606a" ON "seeker_competences_competence"  ("seekerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_41ca1f49921487c28a278918fe" ON "seeker_competences_competence"  ("competenceId") `);
        await queryRunner.query(`CREATE TABLE "seeker_activity_sectors_activity_sector" ("seekerId" integer NOT NULL, "activitySectorId" integer NOT NULL, CONSTRAINT "PK_969c119c3f9f3e3b9789e0a4820" PRIMARY KEY ("seekerId", "activitySectorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fbf4bd024586a328d270739f21" ON "seeker_activity_sectors_activity_sector"  ("seekerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d7df468a4255b2d82ec9983dd" ON "seeker_activity_sectors_activity_sector"  ("activitySectorId") `);
        await queryRunner.query(`ALTER TABLE "seeker" ADD CONSTRAINT "FK_20bb01672b489f23ffb33c07ca3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recruiter" ADD CONSTRAINT "FK_a6593fa02ecf157f21614905275" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interaction" ADD CONSTRAINT "FK_4cdaa54caf1c0b605b5cbc44f3e" FOREIGN KEY ("recruiterId") REFERENCES "recruiter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interaction" ADD CONSTRAINT "FK_7f968db0c045dd92176e61fd57e" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_a429d598a14ab11130a6c387920" FOREIGN KEY ("recruiterId") REFERENCES "recruiter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_1f98475af6bf73abaa384668ccf" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_8b8b24e4c2628a54eb63aa49933" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_df3b92aa295640d070922ebc382" FOREIGN KEY ("attemptId") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seeker_localisations_localisation" ADD CONSTRAINT "FK_1883505acd057fe532500c4e76c" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "seeker_localisations_localisation" ADD CONSTRAINT "FK_341fdf829b5cc9e1959da6114f6" FOREIGN KEY ("localisationId") REFERENCES "localisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seeker_competences_competence" ADD CONSTRAINT "FK_7f0aa557ac1cfff3fd8704606a0" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "seeker_competences_competence" ADD CONSTRAINT "FK_41ca1f49921487c28a278918fe8" FOREIGN KEY ("competenceId") REFERENCES "competence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seeker_activity_sectors_activity_sector" ADD CONSTRAINT "FK_fbf4bd024586a328d270739f214" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "seeker_activity_sectors_activity_sector" ADD CONSTRAINT "FK_0d7df468a4255b2d82ec9983dd4" FOREIGN KEY ("activitySectorId") REFERENCES "activity_sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seeker_activity_sectors_activity_sector" DROP CONSTRAINT "FK_0d7df468a4255b2d82ec9983dd4"`);
        await queryRunner.query(`ALTER TABLE "seeker_activity_sectors_activity_sector" DROP CONSTRAINT "FK_fbf4bd024586a328d270739f214"`);
        await queryRunner.query(`ALTER TABLE "seeker_competences_competence" DROP CONSTRAINT "FK_41ca1f49921487c28a278918fe8"`);
        await queryRunner.query(`ALTER TABLE "seeker_competences_competence" DROP CONSTRAINT "FK_7f0aa557ac1cfff3fd8704606a0"`);
        await queryRunner.query(`ALTER TABLE "seeker_localisations_localisation" DROP CONSTRAINT "FK_341fdf829b5cc9e1959da6114f6"`);
        await queryRunner.query(`ALTER TABLE "seeker_localisations_localisation" DROP CONSTRAINT "FK_1883505acd057fe532500c4e76c"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_df3b92aa295640d070922ebc382"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_8b8b24e4c2628a54eb63aa49933"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_1f98475af6bf73abaa384668ccf"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_a429d598a14ab11130a6c387920"`);
        await queryRunner.query(`ALTER TABLE "interaction" DROP CONSTRAINT "FK_7f968db0c045dd92176e61fd57e"`);
        await queryRunner.query(`ALTER TABLE "interaction" DROP CONSTRAINT "FK_4cdaa54caf1c0b605b5cbc44f3e"`);
        await queryRunner.query(`ALTER TABLE "recruiter" DROP CONSTRAINT "FK_a6593fa02ecf157f21614905275"`);
        await queryRunner.query(`ALTER TABLE "seeker" DROP CONSTRAINT "FK_20bb01672b489f23ffb33c07ca3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d7df468a4255b2d82ec9983dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbf4bd024586a328d270739f21"`);
        await queryRunner.query(`DROP TABLE "seeker_activity_sectors_activity_sector"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_41ca1f49921487c28a278918fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f0aa557ac1cfff3fd8704606a"`);
        await queryRunner.query(`DROP TABLE "seeker_competences_competence"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_341fdf829b5cc9e1959da6114f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1883505acd057fe532500c4e76"`);
        await queryRunner.query(`DROP TABLE "seeker_localisations_localisation"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "attempt"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_senderrole_enum"`);
        await queryRunner.query(`DROP TABLE "interaction"`);
        await queryRunner.query(`DROP TYPE "public"."interaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "recruiter"`);
        await queryRunner.query(`DROP TABLE "activity_sector"`);
        await queryRunner.query(`DROP TABLE "seeker"`);
        await queryRunner.query(`DROP TYPE "public"."seeker_videostatus_enum"`);
        await queryRunner.query(`DROP TABLE "competence"`);
        await queryRunner.query(`DROP TABLE "localisation"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
