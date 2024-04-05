import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './modules/book/book.module';
import { Book } from './modules/book/book.entity';
import { join } from 'path';

import { PersonModule } from './modules/person/person.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { ActionModule } from './modules/action/action.module';
import { DynastyModule } from './modules/dynasty/dynasty.module';
import { LanguageModule } from './modules/language/language.module';
import { ProvinceModule } from './modules/province/province.module';
import { CatalogueModule } from './modules/catalogue/catalogue.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { EditionTypeModule } from './modules/edition-type/edition-type.module';
import { ImageModule } from './modules/image/image.module';
import { BookToPersonModule } from './modules/book-to-person/book-to-person.module';
import { PersonToPersonModule } from './modules/person-to-person/person-to-person.module';

import { getMySQLUsernameAndPassword } from './utils';

const { username, password } = getMySQLUsernameAndPassword();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username,
      password,
      database: 'rare',
      autoLoadEntities: true,
      multipleStatements: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Book]),
    BookModule,
    PersonModule,
    InstitutionModule,
    ActionModule,
    DynastyModule,
    LanguageModule,
    ProvinceModule,
    CatalogueModule,
    DocumentTypeModule,
    EditionTypeModule,
    ImageModule,
    PersonToPersonModule,
    BookToPersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
