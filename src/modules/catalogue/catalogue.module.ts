import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogue } from './catalogue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalogue])],
  providers: [CatalogueService],
  exports: [CatalogueService],
})
export class CatalogueModule {}
