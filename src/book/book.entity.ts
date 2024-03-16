import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryColumn()
  id: string;

  @Column()
  batch: number;

  @Column()
  content_sc: string;

  @Column()
  name: string;

  @Column()
  document_type_id: number;

  @Column()
  catalogue_id: string;

  @Column()
  edition_type_id: string;

  @Column()
  edition_dynasty_id: number;

  @Column()
  edition: string;

  @Column()
  language_id: number;

  @Column()
  province_id: string;

  @Column()
  institution_id: string;

  @Column()
  call_number: string;

  @Column()
  unearth: string;

  @Column()
  is_complete: number;

  @Column()
  quantity: string;

  @Column()
  measurement: string;

  @Column()
  link: string;

  @Column()
  decoration: string;

  @Column()
  book_size: string;

  @Column()
  frame_size: string;

  @Column()
  typeset: string;

  @Column()
  copyright: string;
}
