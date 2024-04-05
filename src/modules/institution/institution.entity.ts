import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity('institutions')
export class Institution {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  intro: string;

  @Column()
  province_id: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  books: number;

  @OneToMany(() => Book, (book) => book.institution_o)
  book: Book[];
}
