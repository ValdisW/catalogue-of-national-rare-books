import * as d3 from "d3";
// import { jsonp } from 'vue-jsonp'

let Data = null; // 初始加载进来的数据

export function deepcopy(obj) {
  let obj_ = JSON.stringify(obj);
  return JSON.parse(obj_);
}

export async function loadData() {
  let book_info = await d3.json("/data/data.json");
  let batch_info = await d3.json("/data/batch.json");
  let institution_info = await d3.json("/data/institution.json");
  let province_info = await d3.json("/data/position.json");
  Data = {
    book_info: book_info,
    batch_info: batch_info,
    institution_info: institution_info,
    province_info: province_info,
  };
}

// function process_institution_info(inst_info) {
//     for (let inst_id in inst_info) {
//         let inst = inst_info[inst_id]
//         get_location(inst.name)
//     }
// }

// function get_location(name) {
//     console.log(name)
//     let loc;
//     jsonp('http://api.map.baidu.com/geocoding/v3/', {
//         address: name,
//         output: 'json',
//         ak: 'xsfg4NDlGqYMfYty9IRTLGCoxtMrrp8g'
//       }).then(json => {
//         // 得到我们想要的内容
//         loc = json.result.location
//         console.log("test api",json)
//       })
//     return loc
// }

export function get_data() {
  return Data;
}

export function get_book_info(id) {
  return Data.book_info[id];
}

export function get_batch_list(batchNumber = "第1批") {
  return Data.batch_info[batchNumber];
}

export function get_batch_dynasty_num(batchTitle, dynasty) {
  return Data.batch_info[batchTitle][dynasty].length;
}

export function get_batchTitle_info() {
  let batch = Object.keys(Data.batch_info);
  return batch.sort();
}

export function get_institution_info(institution_id) {
  return Data.institution_info[institution_id];
}

export function get_institution_list() {
  return Object.keys(Data.institution_info);
}

export function get_statics(displayOrder) {
  let data = [];
  let bacthTitle = get_batchTitle_info();
  let dispLength = Object.keys(displayOrder).length;
  for (let i = 0; i < dispLength; i++) {
    let dispTitle = displayOrder[i];
    // console.log(i, dispTitle)
    let dict = {};
    for (let j in bacthTitle) {
      let title = bacthTitle[j];
      let len = 0;
      if (Data.batch_info[title][dispTitle] != undefined)
        len = Object.keys(Data.batch_info[title][dispTitle]).length;
      // console.log(title, Data.batch_info[title], len)
      dict[title] = len;
    }
    data.push(dict);
  }
  // console.log(data)
  return data;
}

export function get_province_list() {
  return Data.province_info;
}
