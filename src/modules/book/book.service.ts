import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { appKeyCheck, hashCodeCheck, timestampCheck } from '../../utils/check';
import { sm4_decrypt, sm4_encrypt } from 'src/utils/cipher';

import { Book } from './book.entity';
import { DocumentType } from '../document-type/document-type.entity';
import { Language } from '../language/language.entity';
import { Catalogue } from '../catalogue/catalogue.entity';
import { Province } from '../province/province.entity';
import { Institution } from '../institution/institution.entity';
import { Dynasty } from '../dynasty/dynasty.entity';
import { BookToPerson } from '../book-to-person/book-to-person.entity';
import { Person } from '../person/person.entity';
import { Action } from '../action/action.entity';

import {
  nl_req,
  nl_res,
  nl_regular_decrypted_req_data,
  nl_regular_decrypted_res_data,
  nl_advanced_decrypted_req_data,
  nl_advanced_decrypted_res_data,
} from './book.type';
import { regularSearchSQL, advancedSearchSQL } from 'src/utils/sql-make';

function check(
  timestamp: string,
  appKey: string,
  hashCode: string,
  sm4Data: string,
): boolean {
  // production
  return (
    timestampCheck(timestamp) &&
    appKeyCheck(appKey) &&
    hashCodeCheck(timestamp, hashCode, sm4Data)
  );
}

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // 按id返回一条古籍信息
  getBookByID(id: string): Promise<Book> {
    return this.bookRepository.findOne({
      select: [
        'id',
        'batch',
        'content_sc',
        'name',
        'document_type_id',
        'catalogue_id',
        'edition_type_id',
        'edition_dynasty_id',
        'edition',
        'language_id',
        'province_id',
        'institution_id',
        'call_number',
        'unearth',
        'is_complete',
        'quantity',
        'measurement',
        'link',
        'decoration',
        'book_size',
        'frame_size',
        'typeset',
        'copyright',
      ],
      where: { id },
    });
  }

  // 返回古籍详情字段（详情页展示内容用）
  getBookDetail(id: string) {
    return this.bookRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect(DocumentType, 'dt', 'b.document_type_id = dt.id')
      .leftJoinAndSelect(Language, 'l', 'b.language_id = l.id')
      .leftJoinAndSelect(Catalogue, 'c', 'b.catalogue_id = c.id')
      .leftJoinAndSelect(Province, 'p', 'b.province_id = p.id')
      .leftJoinAndSelect(Institution, 'i', 'b.institution_id = i.id')
      .select([
        'b.id AS id',
        'batch',
        'content_sc',
        'b.name AS name',
        'dt.name AS document_type',
        'c.name AS catalogue',
        'edition_type_id',
        'edition_dynasty_id',
        'edition',
        'l.name AS language',
        'p.name AS province',
        'i.name AS institution',
        'call_number',
        'unearth',
        'is_complete',
        'quantity',
        'measurement',
        'link',
        'decoration',
        'book_size',
        'frame_size',
        'typeset',
        'copyright',
      ])
      .where('b.id = :id', { id })
      .getRawMany();
  }

  // 模糊检索（名录浏览页用）
  regularSearchWeb(query: string) {
    const qb = this.bookRepository.createQueryBuilder('books');
    return qb
      .select([
        'id',
        'batch',
        'content_sc',
        'name',
        'document_type_id',
        'catalogue_id',
        'edition_type_id',
        'edition_dynasty_id',
        'edition',
        'language_id',
        'province_id',
        'institution_id',
        'call_number',
        'unearth',
        'is_complete',
        'quantity',
        'measurement',
        'link',
        'decoration',
        'book_size',
        'frame_size',
        'typeset',
        'copyright',
      ])
      .where(
        "CONCAT_WS('∪',batch,content_sc,name,name_query,id,edition,edition_query) LIKE :pattern",
        { pattern: `%${query}%` },
      )
      .orWhere(
        `language_id IN ${qb
          .subQuery()
          .select('id')
          .from(Language, 'l')
          .where("CONCAT_WS('∪',query,name) LIKE :pattern", {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `document_type_id IN ${qb
          .subQuery()
          .select('id')
          .from(DocumentType, 'dt')
          .where("CONCAT_WS('∪',query,name) LIKE :pattern", {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `edition_dynasty_id IN ${qb
          .subQuery()
          .select('id')
          .from(Dynasty, 'd')
          .where("CONCAT_WS('∪',query,name) LIKE :pattern", {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `province_id IN ${qb
          .subQuery()
          .select('id')
          .from(Province, 'p')
          .where("CONCAT_WS('∪',query,name) LIKE :pattern", {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `institution_id IN ${qb
          .subQuery()
          .select('id')
          .from(Institution, 'i')
          .where("CONCAT_WS('∪',query,name) LIKE :pattern", {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `id IN ${qb
          .subQuery()
          .select('book_id')
          .from(BookToPerson, 'bp')
          .where(
            `action_id IN ${qb
              .subQuery()
              .select('id')
              .from(Action, 'a')
              .where('name LIKE :pattern', {
                pattern: `%${query}%`,
              })
              .getQuery()}`,
          )
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `id IN ${qb
          .subQuery()
          .select('book_id')
          .from(BookToPerson, 'bp')
          .where('person LIKE :pattern', {
            pattern: `%${query}%`,
          })
          .orWhere('institution_name LIKE :pattern', {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `id IN ${qb
          .subQuery()
          .select('book_id')
          .from(BookToPerson, 'bp')
          .where(
            `person_id IN ${qb
              .subQuery()
              .select('id')
              .from(Person, 'p')
              .where(
                `dynasty_id IN ${qb
                  .subQuery()
                  .select('id')
                  .from(Dynasty, 'd')
                  .where('name LIKE :pattern', {
                    pattern: `%${query}%`,
                  })
                  .getQuery()}`,
              )
              .getQuery()}`,
          )
          .getQuery()}`,
        { query },
      )
      .orWhere(
        `id IN ${qb
          .subQuery()
          .select('book_id')
          .from(BookToPerson, 'bp')
          .where('person_status LIKE :pattern', {
            pattern: `%${query}%`,
          })
          .getQuery()}`,
        { query },
      )
      .getRawMany();
  }

  // 高级检索（名录浏览页用）
  advancedSearchWeb(conds: { attr: string; value: string }[]) {
    const attr_table_map = {
      document_type: 'document_types',
      edition_dynasty: 'dynasties',
      language: 'languages',
      province: 'provinces',
      institution: 'institutions',
    };
    const qb = this.bookRepository.createQueryBuilder('books');
    qb.select([
      'id',
      'batch',
      'content_sc',
      'name',
      'document_type_id',
      'catalogue_id',
      'edition_type_id',
      'edition_dynasty_id',
      'edition',
      'language_id',
      'province_id',
      'institution_id',
      'call_number',
      'unearth',
      'is_complete',
      'quantity',
      'measurement',
      'link',
      'decoration',
      'book_size',
      'frame_size',
      'typeset',
      'copyright',
    ]);
    conds.forEach((cond: { attr: string; value: string }) => {
      switch (cond.attr) {
        case 'document_type':
        case 'edition_dynasty':
        case 'language':
        case 'province':
        case 'institution':
          qb.andWhere(
            `${cond.attr}_id IN ${qb
              .subQuery()
              .select('id')
              .from(attr_table_map[cond.attr], cond.attr)
              .where("CONCAT_WS('∪',query,name) LIKE :pattern", {
                pattern: `%${cond.value}%`,
              })
              .getQuery()}`,
          );
          break;
        case 'id':
        case 'batch':
          qb.andWhere(`${cond.attr} LIKE :pattern`, {
            pattern: `%${cond.value}%`,
          });
          break;
        case 'action':
          qb.andWhere(
            `id IN ${qb
              .subQuery()
              .select('book_id')
              .from(BookToPerson, 'bp')
              .where(
                `action_id IN ${qb
                  .subQuery()
                  .select('id')
                  .from(Action, 'a')
                  .where('name LIKE :pattern', { pattern: `%${cond.value}%` })
                  .getQuery()}`,
              )
              .getQuery()}`,
          );
          break;
        case 'person_name':
          qb.andWhere(
            `id IN ${qb
              .subQuery()
              .select('book_id')
              .from(BookToPerson, 'bp')
              .where('person LIKE :pattern', { pattern: `%${cond.value}%` })
              .orWhere('institution_name LIKE :pattern', {
                pattern: `%${cond.value}%`,
              })
              .getQuery()}`,
          );
          break;
        case 'person_dynasty':
          qb.andWhere(
            `id IN ${qb
              .subQuery()
              .select('book_id')
              .from(BookToPerson, 'bp')
              .where(
                `person_id IN ${qb
                  .subQuery()
                  .select('id')
                  .from(Person, 'p')
                  .where(
                    `dynasty_id IN ${qb
                      .subQuery()
                      .select('id')
                      .from(Dynasty, 'd')
                      .where('name LIKE :pattern', {
                        pattern: `%${cond.value}%`,
                      })
                      .getQuery()}`,
                  )
                  .getQuery()}`,
              )
              .getQuery()}`,
          );
          break;
        case 'person_status':
          qb.andWhere(
            `id IN ${qb
              .subQuery()
              .select('book_id')
              .from(BookToPerson, 'bp')
              .where(`person_status LIKE :pattern`, {
                pattern: `%${cond.value}%`,
              })
              .getQuery()}`,
          );
          break;
        case 'name':
        case 'edition':
          qb.andWhere(
            `CONCAT_WS('∪',${cond.attr}_query,${cond.attr}) LIKE :pattern`,
            { pattern: `%${cond.value}%` },
          );
          break;
      }
    });
    return qb.getRawMany();
  }

  getAllBooks() {
    return this.bookRepository.find({
      select: [
        'id',
        'batch',
        'name',
        'language_id',
        'document_type_id',
        'edition_dynasty_id',
        'institution_id',
      ],
    });
  }

  // 分页获取全部古籍
  findAllAndCut(pageSize: number, pageNo: number): Promise<[Book[], number]> {
    return this.bookRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
  }

  // 平台用，普通检索
  async regularSearch(req: nl_req): Promise<nl_res> {
    // 验证时间戳、appKey、hashCode
    if (check(req.clientTime, req.appKey, req.hashCode, req.data)) {
      try {
        // sm4解密，获取data部分
        const data: nl_regular_decrypted_req_data = JSON.parse(
          sm4_decrypt(req.data),
        );

        // 执行检索
        const results = regularSearchSQL(
          data.title,
          data.pageNo,
          data.pageSize,
          data.dateType,
          data.resultType,
        );
        const resultList = await this.bookRepository.query(results[0]);
        const totalCount = (await this.bookRepository.query(results[1]))[0]
          .count;

        let res_data: nl_regular_decrypted_res_data;
        if (data.resultType == '1') {
          // 构建全文结果
          res_data = {
            totalCount,
            totalPage: '' + Math.ceil(totalCount / parseInt(data.pageSize)),
            pageNo: data.pageNo,
            pageSize: data.pageSize,
            resultList: resultList.map((result) => {
              return {
                title: result.name || '-', // 题名
                author: result.author || '-', // 作者(可能不存在）
                keyword: '-', // 主题词(可能不存在）
                url: `http://202.106.125.245:8080/#/book/${result.id}`, // 访问地址
                classify: result.catalogue || '-', // 分类（可能不存在）
                introduction: result.content_sc || '-', // 全文（可能不存在）
              };
            }),
          };
        } else {
          // 构建图书结果
          res_data = {
            totalCount,
            totalPage: '' + Math.ceil(totalCount / parseInt(data.pageSize)),
            pageNo: data.pageNo,
            pageSize: data.pageSize,
            bookList: resultList.map((result) => {
              return {
                imgUrl:
                  result.allowed && result.filename
                    ? `http://202.106.125.245:8080/data/images/${result.folder}/${result.filename}`
                    : '-', // 封面图
                title: result.name || '-', // 题名
                author: result.author || '-', // 作者
                organizer: '-', // 整理者
                classify: result.catalogue || '-', // 分类
                introduction: result.content_sc || '-', // 简介
                url: `http://202.106.125.245:8080/#/book/${result.id}`, // 访问地址
              };
            }),
          };
        }

        return {
          code: '' + HttpStatus.OK,
          data: sm4_encrypt(JSON.stringify(res_data)),
        };
      } catch (error) {
        console.error(error);
        return {
          code: '' + HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'internal server error',
        };
      }
    } else {
      return {
        code: '' + HttpStatus.FORBIDDEN,
        message: 'forbidden',
      };
    }
  }

  // 平台用，高级检索
  async advancedSearch(req: nl_req): Promise<nl_res> {
    // 验证时间戳、appKey、hashCode
    if (check(req.clientTime, req.appKey, req.hashCode, req.data)) {
      try {
        // sm4解密，获取data部分
        const data: nl_advanced_decrypted_req_data = JSON.parse(
          sm4_decrypt(req.data),
        );

        // 执行检索
        const results = advancedSearchSQL(
          data.conditionList,
          data.pageNo,
          data.pageSize,
          data.dateType,
          data.resultType,
        );
        const resultList = await this.bookRepository.query(results[0]);
        const totalCount = (await this.bookRepository.query(results[1]))[0]
          .count;

        let res_data: nl_advanced_decrypted_res_data;
        if (data.resultType == '1' || !data.resultType) {
          // 构建全文结果
          res_data = {
            totalCount,
            totalPage: '' + Math.ceil(totalCount / parseInt(data.pageSize)),
            pageNo: data.pageNo,
            pageSize: data.pageSize,
            resultList: resultList.map((result) => {
              return {
                title: result.name || '-', // 题名
                author: result.author || '-', // 责任者（作者）(可能不存在）
                keyword: '-', // 主题词(可能不存在）
                url: `http://202.106.125.245:8080/#/book/${result.id}`, // 访问地址
                classify: result.catalogue || '-', // 分类（可能不存在）
                introduction: result.content_sc || '-', // 全文（可能不存在）
              };
            }),
          };
        } else {
          // 构建图书结果
          res_data = {
            totalCount,
            totalPage: '' + Math.ceil(totalCount / parseInt(data.pageSize)),
            pageNo: data.pageNo,
            pageSize: data.pageSize,
            bookList: resultList.map((result) => {
              return {
                imgUrl:
                  result.allowed && result.filename
                    ? `http://202.106.125.245:8080/data/images/${result.folder}/${result.filename}`
                    : '-', // 封面图
                title: result.name || '-', // 题名
                author: result.author || '-', // 作者
                organizer: '-', // 整理者
                classify: result.catalogue || '-', // 分类
                introduction: result.content_sc || '-', // 简介
                url: `http://202.106.125.245:8080/#/book/${result.id}`, // 访问地址
              };
            }),
          };
        }

        return {
          code: '' + HttpStatus.OK,
          data: sm4_encrypt(JSON.stringify(res_data)),
        };
      } catch (error) {
        console.error(error);
        // throw new HttpException('' + error, HttpStatus.INTERNAL_SERVER_ERROR);
        return {
          code: '' + HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'internal server error',
        };
      }
    } else {
      return {
        code: '' + HttpStatus.FORBIDDEN,
        message: 'forbidden',
      };
    }
  }
}
