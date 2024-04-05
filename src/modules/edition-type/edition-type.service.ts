import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditionType } from './edition-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EditionTypeService {
  constructor(
    @InjectRepository(EditionType)
    private readonly editionTypeRepository: Repository<EditionType>,
  ) {}

  getAllEditionTypes() {
    return this.editionTypeRepository.find({
      select: ['id', 'name', 'level_1'],
    });
  }
}
