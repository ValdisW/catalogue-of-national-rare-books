import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryColumn()
  id: string;

  @PrimaryColumn()
  inner_id: number;

  @Column()
  folder: string;

  @Column()
  filename: string;

  @Column()
  allowed: string;
}
