import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeekerUpdatedAt1788944350000 implements MigrationInterface {
  name = 'AddSeekerUpdatedAt1788944350000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seeker" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seeker" DROP COLUMN "updatedAt"`);
  }
}
