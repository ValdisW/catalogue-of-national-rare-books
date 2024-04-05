import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity('provinces')
export class Province {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  books: number;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @OneToMany(() => Book, (book) => book.province_o)
  book: Book[];
}
