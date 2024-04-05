import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from './institution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institution])],
  providers: [InstitutionService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
