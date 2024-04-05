import { Module } from '@nestjs/common';
import { PersonToPersonService } from './person-to-person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonToPerson } from './person-to-person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonToPerson])],
  providers: [PersonToPersonService],
  exports: [PersonToPersonService],
})
export class PersonToPersonModule {}
