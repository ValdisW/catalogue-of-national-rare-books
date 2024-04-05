import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Catalogue } from './catalogue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectRepository(Catalogue)
    private readonly catalogueRepository: Repository<Catalogue>,
  ) {}

  getAllCatalogues() {
    return this.catalogueRepository.find({
      select: [
        'id',
        'name',
        'level_1',
        'level_2',
        'level_3',
        'level_4',
        'level_5',
      ],
    });
  }
}
