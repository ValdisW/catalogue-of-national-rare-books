var express = require("express");
var router = express.Router();
const mysql = require("mysql");
// const mysqlx = require("@mysql/xdevapi");

const connection_config = {
  host: "127.0.0.1",
  user: "root",
  password: "pkudh",
  database: "rare",
  multipleStatements: true,
};

function query(q) {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection(connection_config);
    connection.connect();
    connection.query(q, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
    connection.end();
  });
}

// const connection_config = "root:pkudh@127.0.0.1";

// function query(q) {
//   return new Promise((resolve, reject) => {
//     let connection = mysqlx.getSession(connection_config).then((s) =>
//       s
//         .sql(q)
//         .execute((result) => resolve(result))
//         .then(() => s.close())
//     );
//   });
// }

// 进入首页的数据加载
router.get("/", function (req, res, next) {
  query(
    `select * from rare.books;
    select * from rare.persons;
    select * from rare.person_person where person1_id!=person2_id;
    select * from rare.actions;
    select * from rare.document_types;
    select * from rare.edition_types;
    select * from rare.languages;
    select * from rare.dynasties;
    select * from rare.institutions;
    select * from rare.provinces;
    select * from rare.catalogues;`
  ).then((result) => {
    res.send(result);
  });
});

// 名录介绍页的预加载
router.get("/introduction-load", (req, res) => {
  query(
    "select id,batch,name,edition_dynasty_id from rare.books;" +
      "select id,type_p from rare.dynasties;" +
      "select * from rare.document_types;" +
      "select * from rare.edition_types;" +
      "select * from rare.languages;" +
      "select * from rare.provinces;" +
      "select * from rare.institutions;"
  ).then((result) => {
    res.send(result);
  });
});

// 古籍浏览页的预加载
router.get("/exploration-load", (req, res) => {
  query(
    "select id,name from rare.document_types;" +
      "select id,name from rare.edition_types;" +
      "select id,name from rare.languages;" +
      "select id,name,type_p from rare.dynasties;" +
      "select * from rare.provinces;" +
      "select * from rare.institutions;"
  ).then((result) => {
    res.send(result);
  });
});

// 书目分析页的预加载
router.get("/relationship-load", (req, res) => {
  query(
    "select id,batch,name,document_type_id,edition_dynasty_id,edition,language_id,institution_id from rare.books;" +
      "select id,name from rare.document_types;" +
      "select id,name from rare.languages;" +
      "select id,name,type_p from rare.dynasties;" +
      "select * from rare.provinces;" +
      "select * from rare.institutions;"
  ).then((result) => {
    res.send(result);
  });
});

// 古籍详情页所需数据
router.get("/book-detail/:bookID", (req, res) => {
  // query(`select book_id,count(book_id) count from rare.book_person where book_id!="${req.params.bookID}" and person in (select person from rare.persons where book_id="${req.params.bookID}" and person!="") group by book_id;`),
  query(`select dynasty_or_nation,person_id,action_id from rare.book_person where book_id="${req.params.bookID}";
    select book_id,inner_id,text,person_name from rare.book_seal where book_id="${req.params.bookID}";`).then(
    (result) => {
      res.send(result);
    }
  );
});

// 人物详情页所需数据
router.get("/person-detail/:personID", (req, res) => {
  query(`select * from rare.book_person where person_id='${req.params.personID}';
    select person_id,count(person_id) count from rare.book_person where person_id not in ("${req.params.personID}","") and book_id in (select book_id from rare.book_person where person_id="${req.params.personID}") group by person_id;`).then(
    (result) => {
      res.send(result);
    }
  );
});

// 机构详情页所需数据
router.get("/institution-detail/:institutionID", (req, res) => {
  query(`select * from rare.books where institution_id="${req.params.institutionID}";`).then((result) => {
    res.send(result);
  });
});

// 检索
// router.get("/text", (req, res) => {
//   let filter_str = "";
//   for (let i in req.query) {
//     if (!req.query[i] || i == "query") continue;
//     filter_str += ` AND ${i} in ('${req.query[i]}')`;
//   }
//   let q = `select * from rare.books where content like '%${req.query.query}%'${filter_str};`;
//   query(q).then((result) => {
//     res.send(result);
//   });
// });

// 古籍浏览 - 检索功能
router.post("/search-for-books", (req, res) => {
  for (let i in req.body.values) req.body.values[i] = `${req.body.values[i].attr} like "%${req.body.values[i].value}%"`;
  let filter_str = "";

  let q = `select * from rare.books where ${req.body.values.join(" AND ")} ${filter_str};`;
  query(q).then((result) => {
    res.send(result);
  });
  // for (let i in req.query) {
  //   if (!req.query[i] || i == "query" || i == "attr") continue;
  //   filter_str += ` AND ${i} in ('${req.query[i]}')`;
  // }
  // let q = `select * from rare.books where ${req.query.attr} like '%${req.query.query}%'${filter_str};`;
  // console.log(q);
  // query(q).then((result) => {
  //   res.send(result);
  // });
});

// 批次统计用
router.get("/batch-data", (req, res) => {
  // 版本年代
  if (req.query.attr == "edition_dynasty")
    query(
      `select type name,count(*) value from rare.dynasties a,(SELECT batch,rare.dynasties.id from rare.books,rare.dynasties where rare.dynasties.id=rare.books.edition_dynasty_id order by id) b where a.id=b.id ${
        req.query.batch == 0 ? "" : "AND batch=" + req.query.batch
      } group by type;`
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

// 按书名检索关系
router.get("/person", (req, res) => {
  // 按人名检索，获取相关的人物
  // query(`select id from rare.persons where name like '%${req.query.text}%';`).then((result) => {
  //   res.send(result);
  // });

  // nodes & links
  query(
    `select id,books from rare.persons,(select distinct person_id from rare.book_person where book_id in (select id from rare.books where name like "%${req.query.text}%") and person_id!="") t1 where id=person_id and person_id!='P000000';
      select person1_id source, person2_id target, count(*) value from rare.person_person where book_id in (select id from rare.books where name like "%${req.query.text}%") and person1_id!=person2_id and person1_id!='P000000' and person2_id!='P000000' group by person1_id,person2_id`
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

module.exports = router;
