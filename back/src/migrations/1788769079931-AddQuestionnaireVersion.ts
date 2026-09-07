import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionnaireVersion1788769079931 implements MigrationInterface {
  name = 'AddQuestionnaireVersion1788769079931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD "questionnaireVersion" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP COLUMN "questionnaireVersion"`,
    );
  }
}
