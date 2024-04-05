// request
export interface nl_req {
  clientTime: string; // 时间戳
  appKey: string; // 分配的appKey
  hashCode: string; // data的sm3摘要
  data: string; // data对象经过sm4加密变成string
}

// response
export interface nl_res {
  code: string;
  message?: string;
  data?: string;
}

// 普通检索的data
export interface nl_regular_decrypted_req_data {
  pageNo: string; // 页码
  pageSize: string; // 每页返回数量
  title: string[]; // 检索词 例：[‘’, ‘’] 当二次检索时会传多个检索词
  dateType: string; // 1出版时间倒序(默认)/2出版时间正序
  resultType: string; // 1全文结果/2图书结果
}

// 普通检索的response
export interface nl_regular_decrypted_res_data {
  pageNo: string;
  pageSize: string;
  totalPage: string;
  totalCount: string;
  resultList?: [
    {
      classify: string; // 分类（可能不存在）
      author: string; // 作者(可能不存在）
      title: string;
      keyword: string; // 主题词(可能不存在）
      url: string;
      introduction: string; // 全文（可能不存在）
    },
  ];
  bookList?: [
    {
      classify: string; // 分类（可能不存在）
      author: string; // 作者(可能不存在）
      title: string;
      keyword: string; // 主题词(可能不存在）
      url: string;
      introduction: string; // 全文（可能不存在）
    },
  ];
}

// 高级检索的data
export interface nl_advanced_decrypted_req_data {
  // data对象经过sm4加密变成string
  pageNo: string;
  pageSize: string;
  synonyms: string; // 关联字检索 如无此项可以忽视
  properNouns: string; // 同义词检索 如无此项可以忽视
  distance: string; // 忽略一个字 如无此项可以忽视
  punc: string; // 忽略标点 如无此项可以忽视
  dateType?: string;
  resultType?: string;
  conditionList: [
    {
      title: string; // 检索词
      type: string; // 下拉选择框类型。title 题名、author责任者、description简介。如支持更多条件对接时沟通
      logic: string; // 逻辑 and 并且 or 或 not 非
      dateType: string; // 1出版时间倒序(默认)/2出版时间正序
      resultType: string; // 1全文结果/2图书结果
    },
  ];
}

// 高级检索的response
export interface nl_advanced_decrypted_res_data {
  totalPage: string;
  pageNo: string;
  pageSize: string;
  totalCount: string;
  resultList?: [
    {
      classify: string;
      author: string;
      title: string;
      keyword: string;
      url: string;
      introduction: string;
    },
  ];
  bookList?: [
    {
      classify: string;
      author: string;
      title: string;
      keyword: string;
      url: string;
      introduction: string;
    },
  ];
}
