import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity('catalogues')
export class Catalogue {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  level_1: string;

  @Column()
  level_2: string;

  @Column()
  level_3: string;

  @Column()
  level_4: string;

  @Column()
  level_5: string;

  @OneToMany(() => Book, (book) => book.catalogue_o)
  book: Book[];
}
