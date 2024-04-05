import { Module } from '@nestjs/common';
import { DynastyService } from './dynasty.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dynasty } from './dynasty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dynasty])],
  providers: [DynastyService],
  exports: [DynastyService],
})
export class DynastyModule {}
