import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Action } from '../action/action.entity';

@Entity('book_person')
export class BookToPerson {
  @PrimaryColumn()
  book_id: string;

  @PrimaryColumn()
  inner_id: number;

  @Column()
  title: string;

  @Column()
  scroll: string;

  @Column()
  record: string;

  @Column()
  dynasty_or_nation: string;

  @Column()
  person_id: string;

  @Column()
  person: string;

  @Column()
  institution_name: string;

  @Column()
  action_id: number;

  @Column()
  action: string;

  @Column()
  person_status: string;

  @Column()
  level: number;

  @Column()
  edition: string;

  @Column()
  edition_type: string;

  @Column()
  edition_type_id: string;

  @Column()
  start_reign: string;

  @Column()
  start_year: string;

  @Column()
  end_reign: string;

  @Column()
  end_year: string;

  @Column()
  place_ancient: string;

  @Column()
  place_modern: string;

  @Column()
  mark: string;

  @Column()
  edition_dynasty: string;

  @ManyToOne(() => Action, (action_o) => action_o.bookToPerson)
  @JoinColumn({ name: 'action_id', referencedColumnName: 'id' })
  action_o: Action;
}
