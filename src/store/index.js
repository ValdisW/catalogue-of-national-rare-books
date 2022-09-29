import { createStore } from "vuex";

export default createStore({
  state: {
    books: [],
    persons: [],
    person_ralations: [],
    all_action: [],
    all_document_type: [],
    all_edition_type: [],
    all_language: [],
    all_edition_dynasty: [],
    all_institution: [],
    all_province: [],
    all_catalogue: [],
    rem: null,
    batchTitle: "第1批",
  },
  getters: {
    getData: (state) => state.books,
  },
  mutations: {
    loadIntroductionData(state, _data) {
      [state.all_action, state.persons] = _data;
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
      ] = _data;
    },
    changeRem(state, payload) {
      state.rem = payload;
    },
    changeBatchTitle(state, payload) {
      state.batchTitle = payload;
    },
  },
  actions: {},
  modules: {},
});
