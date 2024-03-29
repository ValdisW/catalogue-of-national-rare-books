import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { Book } from './book/book.entity';
import { join } from 'path';

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
      // password: 'ZGGJML.im',
      database: 'rare',
      autoLoadEntities: true,
      multipleStatements: true,
    }),
    BookModule,
    TypeOrmModule.forFeature([Book]), // ?
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
