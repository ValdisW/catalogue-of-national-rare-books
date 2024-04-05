import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceModule {}
