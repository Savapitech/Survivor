import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeekerUpdatedAtIdIndex1788944400000
  implements MigrationInterface
{
  name = 'AddSeekerUpdatedAtIdIndex1788944400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_seeker_updatedAt_id" ON "seeker" ("updatedAt" DESC, "id" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_seeker_updatedAt_id"`);
  }
}
