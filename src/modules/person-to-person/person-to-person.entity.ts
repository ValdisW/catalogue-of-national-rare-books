import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('person_person')
export class PersonToPerson {
  @PrimaryColumn()
  rid: number;

  @Column()
  person1_id: string;

  @Column()
  action1_id: number;

  @Column()
  person2_id: string;

  @Column()
  action2_id: number;

  @Column()
  book_id: string;
}
