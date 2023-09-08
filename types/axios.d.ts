export interface RelatedBook {
  book_id: string;
  inner_id: string;
  title: string;
  scroll: string;
  record: string;
  dynasty_or_nation: string;
  person_id: string;
  person: string;
  institution_name: string;
  action_id: string;
  action: string;
  type: string;
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
  edition_dynasty: string;
}

export interface RelatedPerson {
  person_id: string;
  count: number;
}

export interface Filter {
  name: string;
  ids: Array<string>;
  value: number;
  selected: boolean;
}
