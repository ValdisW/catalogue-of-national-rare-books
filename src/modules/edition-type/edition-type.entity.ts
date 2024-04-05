import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('edition_types')
export class EditionType {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  level_1: string;

  @Column()
  level_2: string;

  @Column()
  level_3: string;

  @Column()
  level_4: string;

  @Column()
  type: string;
}
