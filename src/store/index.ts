import { App } from "vue";
import { createStore } from "vuex";

import { BookImage, RelatedPerson, Book } from "#/axios";

import { addData, readData } from "./idb";

const store = createStore({
  state: {
    books: Array<Book>,
    persons: Array<RelatedPerson>,
    person_ralations: [],
    all_action: [],
    all_document_type: [],
    all_edition_type: [],
    all_language: [],
    all_edition_dynasty: [],
    all_institution: [],
    all_province: [],
    all_catalogue: [],
    all_image: Array<BookImage>,
    rem: null,
  },
  getters: {
    getData: (state) => state.books,
  },
  mutations: {
    loadIntroductionData(state, _data) {
      state.persons = _data;
    },
    preloadIntroductionData(state, _data) {
      addData("all_edition_dynasty", _data[1]);
      addData("all_document_type", _data[2]);
      addData("all_catalogue", _data[3]);
      addData("all_edition_type", _data[4]);
      addData("all_language", _data[5]);
      addData("all_province", _data[6]);
      addData("all_institution", _data[7]);
      addData("all_image", _data[8]);
      addData("books", _data[0]);

      let temp = [];
      [
        temp,
        state.all_edition_dynasty,
        state.all_document_type,
        state.all_catalogue,
        state.all_edition_type,
        state.all_language,
        state.all_province,
        state.all_institution,
        state.all_image,
      ] = _data;
    },
    loadExplorationData(state, _data) {
      [
        state.all_document_type,
        state.all_edition_type,
        state.all_language,
        state.all_edition_dynasty,
        state.all_province,
        state.all_institution,
        state.all_image,
        state.persons,
        state.all_action,
      ] = _data;
    },
    loadRelationshipData(state, _data) {
      [
        state.books,
        state.persons,
        state.all_document_type,
        state.all_language,
        state.all_edition_dynasty,
        state.all_province,
        state.all_institution,
        state.person_ralations,
        state.all_action,
        state.all_image,
      ] = _data;
    },
    changeRem(state, payload) {
      state.rem = payload;
    },
  },
  // actions: {},
  // modules: {},
});

export function setupStore(app: App) {
  app.use(store);
}

export { store };
