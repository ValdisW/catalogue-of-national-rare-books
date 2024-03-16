const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// 保证进程不退出
process.on("uncaughtException", function (err) {
  console.error(err);
});

function getPersonByKeyword(kwd) {
  return `select id from rare.persons where name like '%${kwd}%';`;
}

function getRelatedPersons(personID, minRelations) {
  return `select person_id,count(person_id) count from rare.book_person where person_id not in ("${personID}","") and book_id in (select book_id from rare.book_person where person_id="${personID}") group by person_id having count >= ${minRelations};`;
}

const fs = require("fs");
const os = require("os");
const path = require("path");

function getMySQLUsernameAndPassword() {
  return {
    user: fs.readFileSync(path.resolve(os.homedir(), ".mysql", "username")),
    password: fs.readFileSync(path.resolve(os.homedir(), ".mysql", "password")),
  };
}

const { user, password } = getMySQLUsernameAndPassword();

const connection_config = {
  host: "127.0.0.1",
  user,
  password,
  database: "rare",
  multipleStatements: true,
};

const pool = mysql.createPool(connection_config);

function query(q) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else {
        connection.query(q, (err, result) => {
          if (err) reject(err);
          else {
            connection.release();
            resolve(result);
          }
        });
      }
    });
  });
}

// function query(q) {
//   return new Promise((resolve, reject) => {
//     let connection = mysql.createConnection(connection_config);
//     connection.connect();
//     connection.query(q, (err, result) => {
//       if (err) reject(err);
//       resolve(result);
//     });
//     connection.end();
//   });
// }

// 进入首页的数据加载
router.get("/", function (req, res) {
  query(
    `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books;
    select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons;
    select rid,person1_id,action1_id,person2_id,action2_id,book_id from rare.person_person where person1_id!=person2_id;
    select id,name,type from rare.actions;
    select id,name from rare.document_types;
    select id,name,level_1 from rare.edition_types;
    select id,name,type from rare.languages;
    select id,name,type_p from rare.dynasties;
    select id,name,intro,province_id,lat,lng,books from rare.institutions;
    select id,name,books,lat,lng from rare.provinces;
    select id,name,level_1,level_2,level_3,level_4,level_5 from rare.catalogues;`
  ).then((result) => {
    res.send(result);
  });
});

// 名录介绍页的预加载
router.get("/introduction-preload", (req, res) => {
  query(
    "select id,batch,name,language_id,document_type_id,edition_dynasty_id,institution_id from rare.books;" +
      "select id,name,type_p from rare.dynasties;" +
      "select id,name from rare.document_types;" +
      "select id,name,level_1,level_2,level_3,level_4,level_5 from rare.catalogues;" +
      "select id,name,level_1 from rare.edition_types;" +
      "select id,name,type from rare.languages;" +
      "select id,name,books,lat,lng from rare.provinces;" +
      "select id,name,intro,province_id,lat,lng,books from rare.institutions;" +
      "select id,folder,filename,allowed from rare.images;"
  ).then((result) => {
    res.send(result);
  });
});

// 名录介绍页浏览过程中的加载项
router.get("/introduction-load", (req, res) => {
  query(
    "select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons;"
  ).then((result) => {
    res.send(result);
  });
});

// 古籍浏览页的预加载
router.get("/exploration-load", (req, res) => {
  query(
    "select id,name from rare.document_types;" +
      "select id,name,level_1 from rare.edition_types;" +
      "select id,name,type from rare.languages;" +
      "select id,name,type_p from rare.dynasties;" +
      "select id,name,books,lat,lng from rare.provinces;" +
      "select id,name,intro,province_id,lat,lng,books from rare.institutions;" +
      "select id,folder,filename,allowed from rare.images;" +
      "select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons;" +
      "select id,name,type from rare.actions;"
  ).then((result) => {
    res.send(result);
  });
});

// 书目分析页的预加载
router.get("/relationship-load", (req, res) => {
  query(
    "select id,batch,name,document_type_id,edition_dynasty_id,edition,language_id,institution_id from rare.books;" +
      "select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons;" +
      "select id,name from rare.document_types;" +
      "select id,name from rare.languages;" +
      "select id,name,type_p from rare.dynasties;" +
      "select id,name,books,lat,lng from rare.provinces;" +
      "select id,name,intro,province_id,lat,lng,books from rare.institutions;" +
      "select rid,person1_id,action1_id,person2_id,action2_id,book_id from rare.person_person where person1_id!=person2_id;" +
      "select id,name,type from rare.actions;" +
      "select id,folder,filename,allowed from rare.images;"
  ).then((result) => {
    res.send(result);
  });
});

// 古籍详情页所需数据
router.get("/book-detail/:bookID", (req, res) => {
  // query(`select book_id,count(book_id) count from rare.book_person where book_id!="${req.params.bookID}" and person in (select person from rare.persons where book_id="${req.params.bookID}" and person!="") group by book_id;`),
  query(`select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books where id="${req.params.bookID}";
  select dynasty_or_nation,person_id,t2.name person_name,action_id,t3.name action_name from rare.book_person t1 left join rare.persons t2 on t1.person_id=t2.id left join rare.actions t3 on t1.action_id=t3.id where book_id="${req.params.bookID}";
    select book_id,inner_id,text,person_name from rare.book_seal where book_id="${req.params.bookID}";`).then(
    (result) => {
      res.send(result);
    }
  );
});

// 人物详情页所需数据
router.get("/person-detail/:personID", (req, res) => {
  let sql_person_info = `select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from rare.persons where id ="${req.params.personID}";`;
  let sql_person_actions = `select book_id,inner_id,title,scroll,record,dynasty_or_nation,person_id,person,institution_name,action_id,action,t.type,person_status,level,edition,edition_type,edition_type_id,start_reign,start_year,end_reign,end_year,place_ancient,place_modern,mark,edition_dynasty from book_person left join rare.actions t on action_id=id where person_id='${req.params.personID}';`;
  let sql_person_related = `select person_id,count(person_id) count from book_person where person_id not in ("${req.params.personID}","","P000000") and book_id in (select book_id from rare.book_person where person_id="${req.params.personID}") group by person_id;`;
  query(sql_person_info + sql_person_actions + sql_person_related).then((result) => {
    res.send(result);
  });
});

// 机构详情页所需数据
router.get("/institution-detail/:institutionID", (req, res) => {
  query(
    `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books where institution_id="${req.params.institutionID}";`
  ).then((result) => {
    res.send(result);
  });
});

const attr_table_map = {
  document_type: "document_types",
  edition_dynasty: "dynasties",
  language: "languages",
  province: "provinces",
  institution: "institutions",
};

// 古籍浏览 - 指定字段检索
router.post("/search-for-books", (req, res) => {
  // 举例：req.body.values = [{attr: "edition", value: "唐"}]
  // 遍历多字段检索
  for (let i in req.body.values) {
    req.body.values[i].value = req.body.values[i].value.replaceAll("∪", "");
    // 带id的字段
    if (
      ["document_type", "edition_dynasty", "language", "province", "institution"].indexOf(req.body.values[i].attr) != -1
    )
      req.body.values[i] = `${req.body.values[i].attr}_id in (select id from rare.${
        attr_table_map[req.body.values[i].attr]
      } where concat_ws('∪',query,name) like "%${req.body.values[i].value}%")`;
    else if (["id", "batch"].indexOf(req.body.values[i].attr) != -1) {
      req.body.values[i] = `${req.body.values[i].attr} like "%${req.body.values[i].value}%"`;
    } else
      req.body.values[
        i
      ] = `concat_ws('∪',${req.body.values[i].attr}_query,${req.body.values[i].attr}) like "%${req.body.values[i].value}%"`;
  }
  let filter_str = "";

  let q = `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books where ${req.body.values.join(
    " AND "
  )} ${filter_str};`;
  query(q).then((result) => {
    res.send(result);
  });
});

// 全字段檢索
router.post("/search-all", (req, res) => {
  req.body.query = req.body.query.replaceAll("∪", "");
  query(`select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from rare.books where concat_ws('∪',batch,content_sc,name,name_query,id,edition,edition_query) like "%${req.body.query}%" 
  or language_id in (select id from rare.languages where concat_ws('∪',query,name) like "%${req.body.query}%")
  or document_type_id in (select id from rare.document_types where concat_ws('∪',query,name) like "%${req.body.query}%")
  or edition_dynasty_id in (select id from rare.dynasties where concat_ws('∪',query,name) like "%${req.body.query}%")
  or province_id in (select id from rare.provinces where concat_ws('∪',query,name) like "%${req.body.query}%")
  or institution_id in (select id from rare.institutions where concat_ws('∪',query,name) like "%${req.body.query}%");`).then(
    (result) => {
      res.send(result);
    }
  );
});

// 批次统计用
router.get("/batch-data", (req, res) => {
  // 版本年代
  if (req.query.attr == "edition_dynasty")
    query(
      `select type name,count(*) value from rare.dynasties a,(SELECT batch,rare.dynasties.id from rare.books,rare.dynasties where rare.dynasties.id=rare.books.edition_dynasty_id order by id) b where a.id=b.id ${
        req.query.batch == 0 ? "" : "AND batch=" + req.query.batch
      } group by type order by value desc;`
    ).then((result) => {
      res.send(result);
    });
  // 版本类型
  else if (req.query.attr == "edition_type")
    query(
      `select type name,count(*) value from rare.edition_types a,(SELECT batch,rare.edition_types.id from rare.books,rare.edition_types where rare.edition_types.id=rare.books.edition_type_id order by id) b where a.id=b.id ${
        req.query.batch == 0 ? "" : "AND batch=" + req.query.batch
      } group by type order by value desc;`
    ).then((result) => {
      res.send(result);
    });
  // 文献类型
  else if (req.query.attr == "document_type")
    query(
      `select b.name, count(*) value from rare.books a,rare.document_types b where a.document_type_id=b.id ${
        req.query.batch == 0 ? "" : "and batch=" + req.query.batch
      } group by b.name order by value desc;`
    ).then((result) => {
      res.send(result);
    });
  // 文种
  else {
    query(
      `select b.type name, count(*) value from rare.books a,rare.languages b where a.language_id=b.id ${
        req.query.batch == 0 ? "" : "and batch=" + req.query.batch
      } group by b.type order by value desc;`
    ).then((result) => {
      res.send(result);
    });
  }
});

// 根据古籍名录号，获取古籍信息
router.get("/get-book-data/:id", (req, res) => {
  query(
    `select id,batch,content_sc,name,document_type_id,catalogue_id,edition_type_id,edition_dynasty_id,edition,language_id,province_id,institution_id,call_number,unearth,is_complete,quantity,measurement,link,decoration,book_size,frame_size,typeset,copyright from books where id=${req.params.id};`
  ).then((result) => {
    res.send(result);
  });
});

// 根据人物ID，获取人物信息
router.get("/get-person-data/:id", (req, res) => {
  query(
    `select id,name,courtesy_name,pseudonym_name,posthumous_name,nation_id,dynasty_id,year_of_birth,year_of_death,introduction from persons where id="${req.params.id}";`
  ).then((result) => {
    res.send(result);
  });
});

// 按书名检索关系
router.get("/person", (req, res) => {
  req.query.text = req.query.text.replaceAll("∪", "");

  // 按人名检索，获取相关的人物
  // query(`select id from rare.persons where name like '%${req.query.text}%';`).then((result) => {
  //   res.send(result);
  // });

  // nodes & links
  query(
    //`select id,books from rare.persons,(select distinct person_id from rare.book_person where book_id in (select id from rare.books where name like "%${req.query.text}%") and person_id!="") t1 where id=person_id and person_id!='P000000';
    `select person_id id,count(*) books from rare.book_person where book_id in (select id from rare.books where concat_ws('∪',name_query,name) like "%${req.query.text}%") and person_id!="" and person_id!="P000000" group by person_id;
    select person1_id source, person2_id target, count(*) value
      from rare.person_person
      where book_id in (select id from rare.books where concat_ws('∪',name_query,name) like "%${req.query.text}%")
        and person1_id!=person2_id
        and person1_id!='P000000'
        and person2_id!='P000000'
    group by person1_id,person2_id`
  ).then((result) => {
    res.send(result);
  });
});

// 按人名检索关系
router.get("/person-relationship", (req, res) => {
  // nodes - 和检索式有关的人
  // 与这些人有一度关系的其他人
  // links - 这些人之间的联系
  query(`SELECT id,books FROM rare.persons where name like "%${req.query.text}%";
    select distinct person_id id,books from rare.book_person a,rare.persons b where a.person_id=b.id AND book_id in (select distinct book_id from rare.book_person where person_id in (SELECT id FROM rare.persons where name like "%阿%")) and person_id != "" and person_id not in (SELECT id FROM rare.persons where name like "%${req.query.text}%");
    select person1_id source, person2_id target, count(*) value from rare.person_person where book_id in (select id from rare.books where name like "%${req.query.text}%") and person1_id!=person2_id group by person1_id,person2_id`).then(
    (result) => {
      res.send(result);
    }
  );
});

router.get("/related-persons", (req, res) => {
  query(getRelatedPersons(req.query.personID, req.query.minRelations)).then((result) => {
    res.send(result);
  });
});

router.get("/get-person-by-keyword", (req, res) => {
  query(getPersonByKeyword(req.query.kwd)).then((result) => {
    res.send(result);
  });
});

module.exports = router;
