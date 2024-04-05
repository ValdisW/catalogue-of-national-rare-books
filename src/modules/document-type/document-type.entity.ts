import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity('document_types')
export class DocumentType {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  query: string;

  @OneToMany(() => Book, (book) => book.document_type_o)
  book: Book[];
}
