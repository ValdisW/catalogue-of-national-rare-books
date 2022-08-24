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
    rem: null,
    batchTitle: "第1批",
  },
  getters: {
    getData: (state) => state.books,
  },
  mutations: {
    loadData(state, _data) {
      [
        state.books,
        state.persons,
        state.person_ralations,
        state.all_action,
        state.all_document_type,
        state.all_edition_type,
        state.all_language,
        state.all_edition_dynasty,
        state.all_institution,
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
