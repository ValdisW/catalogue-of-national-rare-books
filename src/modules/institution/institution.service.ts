import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Institution } from './institution.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  getAllInstitutions() {
    return this.institutionRepository.find({
      select: ['id', 'name', 'intro', 'province_id', 'lat', 'lng', 'books'],
    });
  }
}
