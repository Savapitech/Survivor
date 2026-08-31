import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SeekersModule } from './seekers/seekers.module';
import { RecruitersModule } from './recruiters/recruiters.module';
import { CompetencesModule } from './competences/competences.module';
import { ActivitySectorsModule } from './activity-sectors/activity-sectors.module';
import { LocalisationsModule } from './localisations/localisations.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { InteractionsModule } from './interactions/interactions.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_KEY ?? 'APP_KEY',
      appSecret: process.env.OBSERVE_SECRET ?? 'APP_SECRET',
      serviceId: process.env.OBSERVE_ID ?? 'APP_ID',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'profilsactifs',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    ProfilesModule,
    SeekersModule,
    RecruitersModule,
    CompetencesModule,
    ActivitySectorsModule,
    LocalisationsModule,
    QuestionnaireModule,
    InteractionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
