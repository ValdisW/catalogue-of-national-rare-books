import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonToPerson } from './person-to-person.entity';
import { Repository } from 'typeorm';
import { Book } from '../book/book.entity';

@Injectable()
export class PersonToPersonService {
  constructor(
    @InjectRepository(PersonToPerson)
    private readonly personToPersonRepository: Repository<PersonToPerson>,
  ) {}

  getAllPersonRalations() {
    return this.personToPersonRepository
      .createQueryBuilder('person_person')
      .where('person_person.person1_id != person_person.person2_id')
      .getMany();
  }

  // 获取与用户输入的书名相关的人物和书的数量
  getPersonVectorByQuery(query: string) {
    const qb =
      this.personToPersonRepository.createQueryBuilder('person_person');
    return qb
      .select([
        'person1_id AS source',
        'person2_id AS target',
        'count(*) AS value',
      ])
      .where(
        `book_id IN ${qb
          .subQuery()
          .select('id')
          .from(Book, 'b')
          .where('CONCAT_WS("∪",name_query,name) LIKE :pattern')
          .getQuery()}`,
        { pattern: `%${query}%` },
      )
      .andWhere('person1_id!=person2_id')
      .andWhere('person1_id!="P000000"')
      .andWhere('person2_id!="P000000"')
      .groupBy('person1_id,person2_id')
      .getRawMany();
  }
}
