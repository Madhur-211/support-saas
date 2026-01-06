import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './business.model';

@Module({
  imports: [SequelizeModule.forFeature([Business])],
  exports: [SequelizeModule],
})
export class BusinessModule {}
