import { Module } from '@nestjs/common';
import { BookToPersonService } from './book-to-person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookToPerson } from './book-to-person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookToPerson])],
  providers: [BookToPersonService],
  exports: [BookToPersonService],
})
export class BookToPersonModule {}
