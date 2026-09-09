import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeekerWithdrawnAt1789030800000 implements MigrationInterface {
  name = 'AddSeekerWithdrawnAt1789030800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seeker" ADD COLUMN IF NOT EXISTS "withdrawnAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "seeker" DROP COLUMN "withdrawnAt"`);
  }
}
