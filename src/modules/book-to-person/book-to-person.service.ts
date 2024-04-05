import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookToPerson } from './book-to-person.entity';
import { Repository } from 'typeorm';
import { Action } from '../action/action.entity';
import { Person } from '../person/person.entity';
import { Book } from '../book/book.entity';

@Injectable()
export class BookToPersonService {
  constructor(
    @InjectRepository(BookToPerson)
    private readonly bookToPersonRepository: Repository<BookToPerson>,
  ) {}

  getAllBookPersonRelations() {
    return this.bookToPersonRepository.find();
  }

  // 获取与用户输入的书名相关的人物和书的数量
  getRelatedPersonsAndCountByQuery(query: string) {
    const qb = this.bookToPersonRepository.createQueryBuilder('book_person');
    return qb
      .select(['person_id id', 'count(*) AS books'])
      .where(
        `book_id IN ${qb
          .subQuery()
          .select('id')
          .from(Book, 'b')
          .where('CONCAT_WS("∪",name_query,name) LIKE :pattern')
          .getQuery()}`,
        { pattern: `%${query}%` },
      )
      .andWhere('person_id != ""')
      .andWhere('person_id != "P000000"')
      .groupBy('person_id')
      .getRawMany();
  }

  // 根据人物id，获取与某本书相关的其他人
  getBookRelatedPersons(bookID: string) {
    return this.bookToPersonRepository
      .createQueryBuilder('t1')
      .leftJoinAndSelect(Person, 't2', 't1.person_id=t2.id')
      .leftJoinAndSelect(Action, 't3', 't1.action_id=t3.id')
      .select([
        'dynasty_or_nation', // 朝代国别
        'person_id', // 人物id
        't2.name AS person_name', // 人名
        'action_id', // 责任行为id
        't3.name AS action_name', // 责任行为
      ])
      .where('book_id = :bookID', { bookID })
      .getRawMany();
  }

  // 获取某人相关的所有书籍及动作分类
  getPersonActions(personID: string) {
    return this.bookToPersonRepository
      .createQueryBuilder('book_person')
      .leftJoinAndSelect(Action, 't', 'book_person.action_id = t.id')
      .select([
        'book_id',
        'inner_id',
        'title',
        'scroll',
        'record',
        'dynasty_or_nation',
        'person_id',
        'person',
        'institution_name',
        'action_id',
        'action',
        't.type as type',
        'person_status',
        'level',
        'edition',
        'edition_type',
        'edition_type_id',
        'start_reign',
        'start_year',
        'end_reign',
        'end_year',
        'place_ancient',
        'place_modern',
        'mark',
        'edition_dynasty',
      ])
      .where('book_person.person_id = :personID', { personID })
      .getRawMany();
  }

  // 获取和某人相关的其他人及共同经历的书籍数
  getRelatedPersonsAndCount(personID: string) {
    const qb = this.bookToPersonRepository.createQueryBuilder('book_person');

    return qb
      .select(['person_id', 'COUNT(person_id) AS count'])
      .where('person_id NOT IN (:...excludedIDs)', {
        excludedIDs: [personID, '', 'P000000'],
      })
      .andWhere(
        `book_id IN ${qb
          .subQuery()
          .select('book_id')
          .from(BookToPerson, 'bp')
          .where('bp.person_id = :pID')
          .getQuery()}`,
        { pID: personID },
      )
      .groupBy('person_id')
      .orderBy('count', 'DESC')
      .printSql()
      .getRawMany();
  }
}
