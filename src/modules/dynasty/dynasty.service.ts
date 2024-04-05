import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dynasty } from './dynasty.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DynastyService {
  constructor(
    @InjectRepository(Dynasty)
    private readonly dynastyRepository: Repository<Dynasty>,
  ) {}

  getAllDynasties() {
    return this.dynastyRepository.find({ select: ['id', 'name', 'type_p'] });
  }
}
