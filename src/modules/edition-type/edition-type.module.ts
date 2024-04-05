import { Module } from '@nestjs/common';
import { EditionTypeService } from './edition-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditionType } from './edition-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EditionType])],
  providers: [EditionTypeService],
  exports: [EditionTypeService],
})
export class EditionTypeModule {}
