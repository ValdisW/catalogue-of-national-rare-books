import { App } from "vue";
import { createStore } from "vuex";

import { RelatedBook, RelatedPerson } from "#/axios";

const store = createStore({
  state: {
    books: Array<RelatedBook>,
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
    all_image: [],
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
      [
        state.books,
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