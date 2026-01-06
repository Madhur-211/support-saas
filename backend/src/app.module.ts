import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/businesses/business.module';
import { UserModule } from './modules/users/user.module';
import { TestController } from './modules/test.controller';
import { TicketsModule } from './modules/tickets/tickets.module';
import { AiModule } from './modules/ai/ai.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        url: config.get<string>('DATABASE_URL'),

        autoLoadModels: true,
        synchronize: true,
        logging: false,

        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    BusinessModule,
    UserModule,
    AuthModule,
    TicketsModule,
    AiModule,
    AnalyticsModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
