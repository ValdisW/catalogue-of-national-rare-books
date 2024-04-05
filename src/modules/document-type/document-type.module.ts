import { Module } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { DocumentType } from './document-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  providers: [DocumentTypeService],
  exports: [DocumentTypeService],
})
export class DocumentTypeModule {}
