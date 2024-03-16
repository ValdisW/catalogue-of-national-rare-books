import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { appKeyCheck, hashCodeCheck, timestampCheck } from '../utlis/check';
import { sm4_decrypt, sm4_encrypt } from 'src/utlis/cipher';

import {
  nl_req,
  nl_res,
  nl_regular_decrypted_req_data,
  nl_regular_decrypted_res_data,
  nl_advanced_decrypted_req_data,
  nl_advanced_decrypted_res_data,
} from './book.type';
import { regularSearchSQL, advancedSearchSQL } from 'src/utlis/sql-make';

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
  findOne(id: string): Promise<Book> {
    return this.bookRepository.findOneBy({ id });
  }

  // 一次性获取全部古籍
  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
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
        let data: nl_regular_decrypted_req_data = JSON.parse(
          sm4_decrypt(req.data),
        );

        // 执行检索
        let results = regularSearchSQL(
          data.title,
          data.pageNo,
          data.pageSize,
          data.dateType,
          data.resultType,
        );
        let resultList = await this.bookRepository.query(results[0]);
        let totalCount = (await this.bookRepository.query(results[1]))[0].count;

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
        let data: nl_advanced_decrypted_req_data = JSON.parse(
          sm4_decrypt(req.data),
        );

        // 执行检索
        let results = advancedSearchSQL(
          data.conditionList,
          data.pageNo,
          data.pageSize,
          data.dateType,
          data.resultType,
        );
        let resultList = await this.bookRepository.query(results[0]);
        let totalCount = (await this.bookRepository.query(results[1]))[0].count;

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
