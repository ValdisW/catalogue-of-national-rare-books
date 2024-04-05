import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  getAllPersons(): Promise<Person[]> {
    return this.personRepository.find({
      select: [
        'id',
        'name',
        'courtesy_name',
        'pseudonym_name',
        'posthumous_name',
        'nation_id',
        'dynasty_id',
        'year_of_birth',
        'year_of_death',
        'introduction',
      ],
    });
  }
  getPersonByID(id: string) {
    return this.personRepository.findOne({
      select: [
        'id',
        'name',
        'courtesy_name',
        'pseudonym_name',
        'posthumous_name',
        'nation_id',
        'dynasty_id',
        'year_of_birth',
        'year_of_death',
        'introduction',
      ],
      where: { id },
    });
  }

  getPersonsByName(name: string) {
    return this.personRepository.find({
      select: ['id'],
      where: { name: Like(`%${name}%`) },
    });
  }
}
