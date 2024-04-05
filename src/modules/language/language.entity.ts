import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity('languages')
export class Language {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  type: string;

  @OneToMany(() => Book, (book) => book.language_o)
  book: Book[];
}
