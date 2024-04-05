import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DocumentType } from '../document-type/document-type.entity';
import { Language } from '../language/language.entity';
import { Catalogue } from '../catalogue/catalogue.entity';
import { Province } from '../province/province.entity';
import { Institution } from '../institution/institution.entity';

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
  name_query: string;

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
  edition_query: string;

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

  @ManyToOne(() => DocumentType, (document_type_o) => document_type_o.book)
  @JoinColumn({ name: 'document_type_id', referencedColumnName: 'id' })
  document_type_o: DocumentType;

  @ManyToOne(() => Language, (language_o) => language_o.book)
  @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
  language_o: Language;

  @ManyToOne(() => Catalogue, (catalogue_o) => catalogue_o.book)
  @JoinColumn({ name: 'catalogue_id', referencedColumnName: 'id' })
  catalogue_o: Catalogue;

  @ManyToOne(() => Province, (province_o) => province_o.book)
  @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
  province_o: Province;

  @ManyToOne(() => Institution, (institution_o) => institution_o.book)
  @JoinColumn({ name: 'institution_id', referencedColumnName: 'id' })
  institution_o: Institution;
}
