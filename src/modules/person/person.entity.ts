import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('persons')
export class Person {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  courtesy_name: string;

  @Column()
  pseudonym_name: string;

  @Column()
  posthumous_name: string;

  @Column()
  nation_id: number;

  @Column()
  dynasty_id: number;

  @Column()
  year_of_birth: string;

  @Column()
  year_of_death: string;

  @Column()
  introduction: string;
}
