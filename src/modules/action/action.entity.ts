import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BookToPerson } from '../book-to-person/book-to-person.entity';

@Entity('actions')
export class Action {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  type: string;

  @OneToMany(() => BookToPerson, (bookToPerson) => bookToPerson.action_o)
  bookToPerson: BookToPerson[];
}
