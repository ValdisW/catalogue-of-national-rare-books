import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 进入首页的数据加载
  // @Get()
  // indexLoad() {
  //   return this.appService.indexLoad();
  // }

  // 名录介绍页的预加载
  @Get('/introduction-preload')
  introPreload() {
    return this.appService.introPreload();
  }

  // 名录介绍页浏览过程中的加载项
  @Get('/introduction-load')
  introLoad() {
    return this.appService.introLoad();
  }

  // 古籍浏览页的预加载
  @Get('/exploration-load')
  explLoad() {
    return this.appService.explLoad();
  }

  // 书目分析页的预加载
  @Get('/relationship-load')
  relLoad() {
    return this.appService.relLoad();
  }

  // 古籍详情页所需数据
  @Get('/book-detail/:bookID')
  bookDetail(@Param('bookID') id: string) {
    return this.appService.bookDetail(id);
  }

  // 人物详情页所需数据
  @Get('/person-detail/:personID')
  personDetail(@Param('personID') id: string) {
    return this.appService.personDetail(id);
  }

  // 机构详情页所需数据
  @Get('/institution-detail/:institutionID')
  instDetail(@Param('institutionID') id: string) {
    return this.appService.instDetail(id);
  }

  // 古籍浏览 - 指定字段检索
  @Post('/search-for-books')
  advancedSearchBook(@Body() body) {
    return this.appService.advancedSearchBook(body);
  }

  // 全字段檢索
  @Post('/search-all')
  regularSearchBook(@Body() body) {
    return this.appService.regularSearchBook(body);
  }

  // 批次统计用
  @Get('/batch-data')
  getBatchData(@Query() query) {
    return this.appService.getBatchData(query);
  }

  // 根据古籍名录号，获取古籍信息
  @Get('/get-book-data/:id')
  getBookByID(@Param('id') id: string) {
    return this.appService.getBookByID(id);
  }

  // 根据人物ID，获取人物信息
  @Get('/get-person-data/:id')
  getPersonByID(@Param('id') id: string) {
    return this.appService.getPersonByID(id);
  }

  // 按书名检索关系
  @Get('/person')
  getRelByBookName(@Query('text') text: string) {
    return this.appService.getRelByBookName(text);
  }

  // 按人名检索关系
  @Get('/person-relationship')
  getRelByPersonName(@Query('text') text: string) {
    return this.appService.getRelByPersonName(text);
  }

  @Get('/related-persons')
  relatedPersons(@Query() query) {
    return this.appService.relatedPersons(query);
  }

  @Get('/get-person-by-keyword')
  getPersonByKwd(@Query('kwd') kwd: string) {
    return this.appService.getPersonByKwd(kwd);
  }
}
