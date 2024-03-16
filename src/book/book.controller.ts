import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { BookService } from './book.service';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  getBook(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Post('regular-search')
  @UseFilters(new HttpExceptionFilter())
  regularSearch(@Body() body) {
    return this.bookService.regularSearch(body);
  }

  @Post('advanced-search')
  @UseFilters(new HttpExceptionFilter())
  advancedSearch(@Body() body) {
    return this.bookService.advancedSearch(body);
  }
}
