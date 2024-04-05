import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  getAllProvinces() {
    return this.provinceRepository.find({
      select: ['id', 'name', 'books', 'lat', 'lng'],
    });
  }
}
