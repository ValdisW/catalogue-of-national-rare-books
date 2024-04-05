import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './modules/book/book.entity';

import { BookService } from './modules/book/book.service';
import { PersonService } from './modules/person/person.service';
import { BookToPersonService } from './modules/book-to-person/book-to-person.service';
import { PersonToPersonService } from './modules/person-to-person/person-to-person.service';
import { DynastyService } from './modules/dynasty/dynasty.service';
import { DocumentTypeService } from './modules/document-type/document-type.service';
import { CatalogueService } from './modules/catalogue/catalogue.service';
import { EditionTypeService } from './modules/edition-type/edition-type.service';
import { LanguageService } from './modules/language/language.service';
import { ProvinceService } from './modules/province/province.service';
import { InstitutionService } from './modules/institution/institution.service';
import { ImageService } from './modules/image/image.service';
import { ActionService } from './modules/action/action.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly actionService: ActionService,
    private readonly bookService: BookService,
    private readonly personService: PersonService,
    private readonly dynastyService: DynastyService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly catalogueService: CatalogueService,
    private readonly editionTypeService: EditionTypeService,
    private readonly languageService: LanguageService,
    private readonly provinceService: ProvinceService,
    private readonly institutionService: InstitutionService,
    private readonly imageService: ImageService,
    private readonly personToPersonService: PersonToPersonService,
    private readonly bookToPersonService: BookToPersonService,
  ) {}

  introPreload() {
    // this.bookService
    //   .advancedSearchWeb([{ attr: 'edition', value: '元年' }])
    //   .then((d) => {
    //     console.log(d, d.length);
    //   });
    return Promise.all([
      this.bookService.getAllBooks(),
      this.dynastyService.getAllDynasties(),
      this.documentTypeService.getAllDocumentTypes(),
      this.catalogueService.getAllCatalogues(),
      this.editionTypeService.getAllEditionTypes(),
      this.languageService.getAllLanguages(),
      this.provinceService.getAllProvinces(),
      this.institutionService.getAllInstitutions(),
      this.imageService.getAllImages(),
    ]);
    // return this.bookRepository.query(
    //   'select id,batch,name,language_id,document_type_id,edition_dynasty_id,institution_id from rare.books;' +
    //     'select id,name,type_p from rare.dynasties;' +
    //     'select id,name from rare.document_types;' +
    //     'select id,name,level_1,level_2,level_3,level_4,level_5 from rare.catalogues;' +
    //     'select id,name,level_1 from rare.edition_types;' +
    //     'select id,name,type from rare.languages;' +
    //     'select id,name,books,lat,lng from rare.provinces;' +
    //     'select id,name,intro,province_id,lat,lng,books from rare.institutions;' +
    //     'select id,folder,filename,allowed from rare.images;',
    // );
  }

  introLoad() {
    return this.personService.getAllPersons();
  }

  explLoad() {
    return Promise.all([
      this.documentTypeService.getAllDocumentTypes(),
      this.editionTypeService.getAllEditionTypes(),
      this.languageService.getAllLanguages(),
      this.dynastyService.getAllDynasties(),
      this.provinceService.getAllProvinces(),
      this.institutionService.getAllInstitutions(),
      this.imageService.getAllImages(),
      this.personService.getAllPersons(),
      this.actionService.getAllActions(),
    ]);
    // return this.bookRepository.query(
    //   'select id,name from rare.document_types;' +
    //     'select id,name,level_1 from rare.edition_types;' +
    //     'select id,name,type from rare.languages;' +
    //     'select id,name,type_p from rare.dynasties;' +
    //     'select id,name,books,lat,lng from rare.provinces;' +
    //     'select id,name,intro,province_id,lat,lng,books from rare.institutions;' +
    //     'select id,folder,filename,allowed from rare.images;' +
    //     'select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons;' +
    //     'select id,name,type from rare.actions;',
    // );
  }

  relLoad() {
    return Promise.all([
      this.bookService.getAllBooks(),
      this.personService.getAllPersons(),
      this.documentTypeService.getAllDocumentTypes(),
      this.languageService.getAllLanguages(),
      this.dynastyService.getAllDynasties(),
      this.provinceService.getAllProvinces(),
      this.institutionService.getAllInstitutions(),
      this.personToPersonService.getAllPersonRalations(),
      this.actionService.getAllActions(),
      this.imageService.getAllImages(),
    ]);
    // return this.bookRepository.query(
    //   'select id,batch,name,document_type_id,edition_dynasty_id,edition,language_id,institution_id from rare.books;' +
    //     'select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons;' +
    //     'select id,name from rare.document_types;' +
    //     'select id,name from rare.languages;' +
    //     'select id,name,type_p from rare.dynasties;' +
    //     'select id,name,books,lat,lng from rare.provinces;' +
    //     'select id,name,intro,province_id,lat,lng,books from rare.institutions;' +
    //     'select rid,person1_id,action1_id,person2_id,action2_id,book_id from rare.person_person where person1_id!=person2_id;' +
    //     'select id,name,type from rare.actions;' +
    //     'select id,folder,filename,allowed from rare.images;',
    // );
  }

  bookDetail(id: string) {
    return Promise.all([
      this.bookService.getBookDetail(id),
      this.bookToPersonService.getBookRelatedPersons(id),
      this.imageService.getBookRelatedImages(id),
    ]);
    // const sql_book_info = `select b.id id,batch,content_sc,b.name name,dt.name document_type,c.name catalogue,edition_type_id,edition_dynasty_id,edition,l.name language,p.name province,i.name institution,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright
    // from rare.books b
    // left join rare.document_types dt on b.document_type_id = dt.id
    // left join rare.languages l on b.language_id = l.id
    // left join rare.catalogues c on b.catalogue_id = c.id
    // left join rare.provinces p on b.province_id = p.id
    // left join rare.institutions i on b.institution_id = i.id
    // where b.id="${id}";`;
    // const sql_related_person_info = `select dynasty_or_nation,person_id,t2.name person_name,action_id,t3.name action_name from rare.book_person t1 left join rare.persons t2 on t1.person_id=t2.id left join rare.actions t3 on t1.action_id=t3.id where book_id="${id}";`;
    // const sql_images_info = `select folder,filename,allowed from rare.images where id = "${id}";`;
    // // const sql_seals_info = `select book_id,inner_id,text,person_name from rare.book_seal where book_id="${id}";`; // 钤印数据，暂时用不到
    // return this.bookRepository.query(
    //   sql_book_info + sql_related_person_info + sql_images_info,
    // );
  }

  personDetail(id: string) {
    return Promise.all([
      this.personService.getPersonByID(id),
      this.bookToPersonService.getPersonActions(id),
      this.bookToPersonService.getRelatedPersonsAndCount(id),
    ]);
    // const sql_person_info = `select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons where id ="${id}";`;
    // const sql_person_actions = `select book_id,inner_id,title,scroll,record,dynasty_or_nation,person_id,person,institution_name,action_id,action,t.type,person_status,level,edition,edition_type,edition_type_id,start_reign,start_year,end_reign,end_year,place_ancient,place_modern,mark,edition_dynasty from book_person left join rare.actions t on action_id=id where person_id='${id}';`;
    // const sql_person_related = `select person_id,count(person_id) count from book_person where person_id not in ("${id}","","P000000") and book_id in (select book_id from rare.book_person where person_id="${id}") group by person_id;`;
    // return this.bookRepository.query(
    //   sql_person_info + sql_person_actions + sql_person_related,
    // );
  }

  // 指定字段检索
  advancedSearchBook(body) {
    return this.bookService.advancedSearchWeb(body.values);
    // const attr_table_map = {
    //   document_type: 'document_types',
    //   edition_dynasty: 'dynasties',
    //   language: 'languages',
    //   province: 'provinces',
    //   institution: 'institutions',
    // };
    // // 遍历多字段检索
    // for (let i = 0; i < body.values.length; i++) {
    //   body.values[i].value = body.values[i].value.replaceAll('∪', '');
    //   if (
    //     [
    //       'document_type',
    //       'edition_dynasty',
    //       'language',
    //       'province',
    //       'institution',
    //     ].indexOf(body.values[i].attr) != -1
    //   )
    //     // 带id的字段（文献类型、版本朝代、文种、收藏省份、收藏机构）的处理方式
    //     body.values[i] = `${body.values[i].attr}_id in (select id from rare.${
    //       attr_table_map[body.values[i].attr]
    //     } where concat_ws('∪',query,name) like "%${body.values[i].value}%")`;
    //   else if (['id', 'batch'].indexOf(body.values[i].attr) != -1) {
    //     // id、批次的处理方式
    //     body.values[
    //       i
    //     ] = `${body.values[i].attr} like "%${body.values[i].value}%"`;
    //   } else if (body.values[i].attr == 'action') {
    //     // 责任行为的处理方式
    //     body.values[
    //       i
    //     ] = `id in (select book_id from rare.book_person where action_id in (select id from rare.actions where name like "%${body.values[i].value}%"))`;
    //   } else if (body.values[i].attr == 'person_name') {
    //     // 责任者名称的处理方式
    //     body.values[
    //       i
    //     ] = `id in (select book_id from rare.book_person where person like "%${body.values[i].value}%" or institution_name like "%${body.values[i].value}%")`;
    //   } else if (body.values[i].attr == 'person_dynasty') {
    //     // 责任者朝代的处理方式
    //     body.values[
    //       i
    //     ] = `id in (select book_id from rare.book_person where person_id in (select id from rare.persons where dynasty_id in (select id from rare.dynasties where name like "%${body.values[i].value}%")))`;
    //   } else if (body.values[i].attr == 'person_status') {
    //     // 责任者身份的处理方式
    //     body.values[
    //       i
    //     ] = `id in (select book_id from rare.book_person where person_status like "%${body.values[i].value}%")`;
    //   } else {
    //     // 题名、版本的处理方式
    //     body.values[
    //       i
    //     ] = `concat_ws('∪',${body.values[i].attr}_query,${body.values[i].attr}) like "%${body.values[i].value}%"`;
    //   }
    // }
    // const filter_str = '';

    // const q = `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books where ${body.values.join(
    //   ' AND ',
    // )} ${filter_str};`;
    // return this.bookRepository.query(q);
  }

  // 全字段检索
  regularSearchBook(body) {
    return this.bookService.regularSearchWeb(body.query);
    // return this.bookRepository.query(
    //   `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books
    //   where concat_ws('∪',batch,content_sc,name,name_query,id,edition,edition_query) like "%${body.query}%"
    //   or language_id in (select id from rare.languages where concat_ws('∪',query,name) like "%${body.query}%")
    //   or document_type_id in (select id from rare.document_types where concat_ws('∪',query,name) like "%${body.query}%")
    //   or edition_dynasty_id in (select id from rare.dynasties where concat_ws('∪',query,name) like "%${body.query}%")
    //   or province_id in (select id from rare.provinces where concat_ws('∪',query,name) like "%${body.query}%")
    //   or institution_id in (select id from rare.institutions where concat_ws('∪',query,name) like "%${body.query}%")
    //   or id in (select book_id from rare.book_person where action_id in (select id from rare.actions where name like "%${body.query}%"))
    //   or id in (select book_id from rare.book_person where person like "%${body.query}%" or institution_name like "%${body.query}%")
    //   or id in (select book_id from rare.book_person where person_id in (select id from rare.persons where dynasty_id in (select id from rare.dynasties where name like "%${body.query}%")))
    //   or id in (select book_id from rare.book_person where person_status like "%${body.query}%");`,
    // );
  }

  // 计算各批次数据，后改成直接提供静态数据，故暂停使用
  // getBatchData(query) {
  //   let q;
  //   // 版本年代
  //   if (query.attr == 'edition_dynasty')
  //     q = `select type name,count(*) value from rare.dynasties a,(SELECT batch,rare.dynasties.id from rare.books,rare.dynasties where rare.dynasties.id=rare.books.edition_dynasty_id order by id) b where a.id=b.id ${
  //       query.batch == 0 ? '' : 'AND batch=' + query.batch
  //     } group by type order by value desc;`;
  //   // 版本类型
  //   else if (query.attr == 'edition_type')
  //     q = `select type name,count(*) value from rare.edition_types a,(SELECT batch,rare.edition_types.id from rare.books,rare.edition_types where rare.edition_types.id=rare.books.edition_type_id order by id) b where a.id=b.id ${
  //       query.batch == 0 ? '' : 'AND batch=' + query.batch
  //     } group by type order by value desc;`;
  //   // 文献类型
  //   else if (query.attr == 'document_type')
  //     q = `select b.name, count(*) value from rare.books a,rare.document_types b where a.document_type_id=b.id ${
  //       query.batch == 0 ? '' : 'and batch=' + query.batch
  //     } group by b.name order by value desc;`;
  //   // 文种
  //   else
  //     q = `select b.type name, count(*) value from rare.books a,rare.languages b where a.language_id=b.id ${
  //       query.batch == 0 ? '' : 'and batch=' + query.batch
  //     } group by b.type order by value desc;`;

  //   return this.bookRepository.query(q);
  // }

  getBookByID(id: string) {
    // return this.bookRepository.query(
    //   `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from books where id=${id};`,
    // );
    return this.bookService.getBookByID(id);
  }

  getPersonByID(id: string) {
    // return this.bookRepository.query(
    //   `select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from persons where id="${id}";`,
    // );
    return this.personService.getPersonByID(id);
  }

  getRelByBookName(text: string) {
    text = text.replaceAll('∪', '');
    return Promise.all([
      this.bookToPersonService.getRelatedPersonsAndCountByQuery(text),
      this.personToPersonService.getPersonVectorByQuery(text),
    ]);
    // return this.bookRepository.query(
    //   // getRelatedPersonsAndCountByQuery
    //   `select person_id id,count(*) books from rare.book_person where book_id in (select id from rare.books where concat_ws('∪',name_query,name) like "%${text}%") and person_id!="" and person_id!="P000000" group by person_id;
    //   select person1_id source, person2_id target, count(*) value
    //   from rare.person_person
    //   where book_id in (select id from rare.books where concat_ws('∪',name_query,name) like "%${text}%")
    //     and person1_id!=person2_id
    //     and person1_id!='P000000'
    //     and person2_id!='P000000'
    //   group by person1_id,person2_id;`,
    // );
  }

  // 暂停使用
  // getRelByPersonName(text: string) {
  //   // nodes - 和检索式有关的人
  //   // 与这些人有一度关系的其他人
  //   // links - 这些人之间的联系
  //   return this.bookRepository.query(
  //     `SELECT id,books FROM rare.persons where name like "%${text}%";
  //     select distinct person_id id,books from rare.book_person a,rare.persons b where a.person_id=b.id AND book_id in (select distinct book_id from rare.book_person where person_id in (SELECT id FROM rare.persons where name like "%阿%")) and person_id != "" and person_id not in (SELECT id FROM rare.persons where name like "%${text}%");
  //     select person1_id source, person2_id target, count(*) value from rare.person_person where book_id in (select id from rare.books where name like "%${text}%") and person1_id!=person2_id group by person1_id,person2_id`,
  //   );
  // }

  // 未使用
  // relatedPersons(query) {
  //   return this.bookRepository.query(
  //     `select person_id,count(person_id) count from rare.book_person where person_id not in ("${query.personID}","") and book_id in (select book_id from rare.book_person where person_id="${query.personID}") group by person_id having count >= ${query.minRelations};`,
  //   );
  // }

  getPersonByKwd(kwd: string) {
    return this.personService.getPersonsByName(kwd);
    // return this.bookRepository.query(
    //   `select id from rare.persons where name like '%${kwd}%';`,
    // );
  }
}
