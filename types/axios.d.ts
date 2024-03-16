// 响应
export interface Response {
  status: number;
  data: Array<any>;
  statusText: string;
  headers: any;
  config: any;
  request: any;
}

// 古籍
export interface Book {
  id?: string; // 古籍id
  batch?: string; // 批次
  content?: string;
  content_sc?: string; // 简体简介
  name?: string; // 书名
  document_type_id?: string; // 版本类型id
  catalogue_id?: string; // 分类id
  edition_type_id?: string; // 版本类型id
  edition_dynasty_id?: string; // 版本朝代id
  edition?: string; // 版本全称
  language_id?: string; // 语种id
  province_id?: string; // 收藏省份id
  institution_id?: string; // 收藏机构id
  call_number?: string; // 索书号
  unearth?: string; // 出土时间
  is_complete?: string; // 是否完整
  quantity?: string; // 数量
  measurement?: string; // 数量的单位
  link?: string; // 链接
  decoration?: string; // 装帧形式
  book_size?: string; // 开本尺寸
  frame_size?: string; // 版框尺寸
  typeset?: string; // 版式
  copyright?: string;
}

// 古籍与人物的关系
export interface Relation {
  book_id: string; // 古籍id
  inner_id: string; // 内部id，表示是该古籍的第n个关系
  title: string; // 书名
  scroll: string; // 卷名
  record: string;
  dynasty_or_nation: string; // 朝代国别
  person_id: string; // 人物id
  person_name: string; // 人物名称
  institution_name: string; // 机构名称
  action_id: string; // 动作id
  action_name: string; // 动作名称
  type: string; // 动作类型
  person_status: string;
  level: string;
  edition: string;
  edition_type: string;
  edition_type_id: string;
  start_reign: string;
  start_year: string;
  end_reign: string;
  end_year: string;
  place_ancient: string;
  place_modern: string;
  mark: string;
  edition_dynasty: string; // 版本朝代
}

// 人物
export interface RelatedPerson {
  person_id: string;
  person_name: string;
  dynasty_or_nation: string;
  count: number;
}

// 书影
export interface BookImage {
  id: string;
  filename: string;
  allowed: string;
  folder: string;
}

export interface Filter {
  name: string;
  ids: Array<string>;
  value: number;
  selected: boolean;
}

export interface Province {
  id?: string;
  name?: string;
  books?: number;
  lat?: number;
  lng?: number;
  child?: Array<string>;
}

export interface Institution {
  id?: string;
  province_id?: string;
  name?: string;
  books?: number;
  lat?: number;
  lng?: number;
  intro?: string;
}
