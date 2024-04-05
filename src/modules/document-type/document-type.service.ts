import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentType } from './document-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}

  getAllDocumentTypes() {
    return this.documentTypeRepository.find({ select: ['id', 'name'] });
  }
}
