import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLikeInteractionType1788851165322
  implements MigrationInterface
{
  name = 'RemoveLikeInteractionType1788851165322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."interaction_type_enum" RENAME TO "interaction_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interaction_type_enum" AS ENUM('view', 'contact', 'favorite')`,
    );
    await queryRunner.query(
      `ALTER TABLE "interaction" ALTER COLUMN "type" TYPE "public"."interaction_type_enum" USING "type"::text::"public"."interaction_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."interaction_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."interaction_type_enum" RENAME TO "interaction_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interaction_type_enum" AS ENUM('view', 'contact', 'favorite', 'like')`,
    );
    await queryRunner.query(
      `ALTER TABLE "interaction" ALTER COLUMN "type" TYPE "public"."interaction_type_enum" USING "type"::text::"public"."interaction_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."interaction_type_enum_old"`);
  }
}
