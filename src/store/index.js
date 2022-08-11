import { createStore } from "vuex";

export default createStore({
  state: {
    books: [],
    persons: [],
    person_ralations: [],
    actions: [],
    document_types: [],
    edition_types: [],
    languages: [],
    dynasties: [],
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
        state.actions,
        state.document_types,
        state.edition_types,
        state.languages,
        state.dynasties,
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
