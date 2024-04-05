import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dynasties')
export class Dynasty {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  query: string;

  @Column()
  type: string;

  @Column()
  type_p: string;
}
