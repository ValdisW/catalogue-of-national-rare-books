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
        state.all_province,
        state.all_catalogue,
      ] = _data;
    },
    loadIntroductionData(state, _data) {
      console.log("加载名录介绍数据");
      [
        state.books,
        state.all_edition_dynasty,
        state.all_document_type,
        state.all_edition_type,
        state.all_language,
        state.all_province,
        state.all_institution,
      ] = _data;
    },
    loadExplorationData(state, _data) {
      console.log("加载古籍浏览数据");
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
      console.log("加载书目分析数据");
      [
        state.books,
        state.all_document_type,
        state.all_language,
        state.all_edition_dynasty,
        state.all_province,
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
