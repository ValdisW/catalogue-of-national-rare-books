// 添加<em></em>
let _replace = (column: string, words: string[], index: number) => {
  if (index < words.length - 1) return `replace(${_replace(column, words, index + 1)},"${words[index]}","<em>${words[index]}</em>")`;
  else return `replace(${column},"${words[index]}","<em>${words[index]}</em>")`;
};
let replace = (column, words, tableAlias?, columnAlias?) => _replace((tableAlias ? tableAlias + '.' : "") + column, words, 0) + ' as ' + (columnAlias ? columnAlias : column);

/**
 * 构建SQL语句
 */
export function regularSearchSQL(words, pageNo, pageSize, dateType, resultType) {
  let kwds = (cond) => words.map((e) => ` ${cond} like "%${e}%"`).join(' and');
  // 构建查询SQL。resultType为1时构建全文结果，否则构建图书结果
  let list_sql = resultType === "1" ?
  `select B.id,${replace("content_sc", words)},${replace("name", words, "B")},${replace("name", words, "C", "catalogue")},${replace("group_concat(BP.person)", words, null, "author")} from rare.books B
  left join rare.catalogues C on catalogue_id=C.id
  left join rare.book_person BP on B.id=book_id and BP.level=1 and BP.person!='□□'
  where (${kwds("concat_ws('∪',batch,content_sc,B.name,name_query,B.id,B.edition,edition_query)")})
  or language_id in (select id from rare.languages where${kwds("concat_ws('∪',query,name)")})
  or document_type_id in (select id from rare.document_types where${kwds("concat_ws('∪',query,name)")})
  or edition_dynasty_id in (select id from rare.dynasties where${kwds("concat_ws('∪',query,name)")})
  or province_id in (select id from rare.provinces where${kwds("concat_ws('∪',query,name)")})
  or institution_id in (select id from rare.institutions where${kwds("concat_ws('∪',query,name)")})
  or B.id in (select book_id from rare.book_person where action_id in (select id from rare.actions where${kwds("name")}))
  or B.id in (select book_id from rare.book_person where${kwds("person")} or${kwds("institution_name")})
  or B.id in (select book_id from rare.book_person where person_id in (select id from rare.persons where dynasty_id in (select id from rare.dynasties where${kwds("name")})))
  or B.id in (select book_id from rare.book_person where${kwds("person_status")})
  group by B.id
  order by edition_dynasty_id ${dateType=="1" ? "desc" : ""}
  limit ${parseInt(pageSize) * (parseInt(pageNo) - 1)},${pageSize};`
  :
  `select B.id,${replace("content_sc", words)},${replace("name", words, "B")},${replace("name", words, "C", "catalogue")},${replace("group_concat(BP.person)", words, null, "author")},min(folder) folder,min(I.filename) filename,min(I.allowed) allowed from rare.books B
  left join rare.catalogues C on catalogue_id=C.id
  left join rare.images I on B.id=I.id and I.inner_id=1
  left join rare.book_person BP on B.id=book_id and BP.level=1 and BP.person!='□□'
  where (${kwds("concat_ws('∪',batch,content_sc,B.name,name_query,B.id,B.edition,edition_query)")})
  or language_id in (select id from rare.languages where${kwds("concat_ws('∪',query,name)")})
  or document_type_id in (select id from rare.document_types where${kwds("concat_ws('∪',query,name)")})
  or edition_dynasty_id in (select id from rare.dynasties where${kwds("concat_ws('∪',query,name)")})
  or province_id in (select id from rare.provinces where${kwds("concat_ws('∪',query,name)")})
  or institution_id in (select id from rare.institutions where${kwds("concat_ws('∪',query,name)")})
  or B.id in (select book_id from rare.book_person where action_id in (select id from rare.actions where${kwds("name")}))
  or B.id in (select book_id from rare.book_person where${kwds("person")} or${kwds("institution_name")})
  or B.id in (select book_id from rare.book_person where person_id in (select id from rare.persons where dynasty_id in (select id from rare.dynasties where${kwds("name")})))
  or B.id in (select book_id from rare.book_person where${kwds("person_status")})
  group by B.id
  order by edition_dynasty_id ${dateType === "1" ? "desc" : ""}
  limit ${parseInt(pageSize) * (parseInt(pageNo) - 1)},${pageSize};`;

  // 构建计数SQL
  let count_sql = `select count(*) count from rare.books where (${kwds("concat_ws('∪',batch,content_sc,name,name_query,id,edition,edition_query)")})
  or language_id in (select id from rare.languages where${kwds("concat_ws('∪',query,name)")})
  or document_type_id in (select id from rare.document_types where${kwds("concat_ws('∪',query,name)")})
  or edition_dynasty_id in (select id from rare.dynasties where${kwds("concat_ws('∪',query,name)")})
  or province_id in (select id from rare.provinces where${kwds("concat_ws('∪',query,name)")})
  or institution_id in (select id from rare.institutions where${kwds("concat_ws('∪',query,name)")})
  or id in (select book_id from rare.book_person where action_id in (select id from rare.actions where${kwds("name")}))
  or id in (select book_id from rare.book_person where${kwds("person")} or${kwds("institution_name")})
  or id in (select book_id from rare.book_person where person_id in (select id from rare.persons where dynasty_id in (select id from rare.dynasties where${kwds("name")})))
  or id in (select book_id from rare.book_person where${kwds("person_status")});`;

  // console.log(list_sql);
  return [list_sql, count_sql];
}

export function advancedSearchSQL(conditionList, pageNo, pageSize, dateType = "1", resultType = "1") {
  let condition_map = {
    title: (t, logic) => `B.name ${logic === "not" ? "not " : " "} like '%${t}%'`,
    description: (t, logic) => `content_sc ${logic === "not" ? "not " : " "} like '%${t}%'`,
    author: (t, logic) =>
      `B.id in (select book_id from rare.book_person where person ${logic === "not" ? "not " : " "} like '%${t}%')`,
  };

  let words = conditionList.map((e) => e.title);
  // console.log("words",words)
  // 构建查询SQL。resultType为1时构建全文结果，否则构建图书结果
  let query;
  if (resultType === '1') {
    query = 
      `select B.id,${replace("content_sc", words)},${replace("name", words, "B")},${replace("name", words, "C", "catalogue")},${replace("group_concat(BP.person)", words, null, "author")} from rare.books B
      left join rare.catalogues C on catalogue_id=C.id
      left join rare.book_person BP on B.id=book_id and BP.level=1 and BP.person!='□□'
      where 1`;
    conditionList.forEach((condition) => {
      // 如果高级检索的title是数组就这样搞
      // let condition_query = ` ${condition.logic} (${condition.title
      //   .map((t) => condition_map[condition.type](t))
      //   .join(' and ')})`;
      // 如果高级检索的title是字符串就这样搞
      let condition_query = ` ${condition.logic === "or" ? "or" : "and"} ${condition_map[condition.type](
        condition.title, condition.logic
      )}`;
      query += condition_query;
    });
    query += ` group by B.id order by edition_dynasty_id ${dateType === "1" ? "desc" : ""}
    limit ${parseInt(pageSize) * (parseInt(pageNo) - 1)},${pageSize};`;
  } else {
    query = 
      `select B.id,${replace("content_sc", words)},${replace("name", words, "B")},${replace("name", words, "C", "catalogue")},${replace("group_concat(BP.person)", words, null, "author")},min(folder) folder,min(I.filename) filename,min(I.allowed) allowed from rare.books B
      left join rare.images I on B.id=I.id and I.inner_id=1
      left join rare.catalogues C on catalogue_id=C.id
      left join rare.book_person BP on B.id=book_id and BP.level=1 and BP.person!='□□'
      where 1`;
    conditionList.forEach((condition) => {
      // 如果高级检索的title是数组就这样搞
      // let condition_query = ` ${condition.logic} (${condition.title
      //   .map((t) => condition_map[condition.type](t))
      //   .join(' and ')})`;
      // 如果高级检索的title是字符串就这样搞
      let condition_query = ` ${condition.logic === "or" ? "or" : "and"} ${condition_map[condition.type](
        condition.title, condition.logic
      )}`;
      query += condition_query;
    });
    query += ` group by B.id order by edition_dynasty_id ${dateType === "1" ? "desc" : ""}
    limit ${parseInt(pageSize) * (parseInt(pageNo) - 1)},${pageSize};`;
  }
  // console.log(query);

  // 构建计数SQL
  let count_sql = 'select count(*) count from rare.books B where 1';
  conditionList.forEach((condition) => {
    // 如果高级检索的title是数组就这样搞
    // let condition_query = ` ${condition.logic} (${condition.title
    //   .map((t) => condition_map[condition.type](t))
    //   .join(' and ')})`;
    // 如果高级检索的title是字符串就这样搞
    let condition_query = ` ${condition.logic === "or" ? "or" : "and"} ${condition_map[condition.type](
      condition.title, condition.logic
    )}`;
    count_sql += condition_query;
  });
  count_sql += ';';
  return [query, count_sql];
}
