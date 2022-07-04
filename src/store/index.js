import { createStore } from "vuex";

export default createStore({
  state: {
    allData: [],
    rem: null,
    batchTitle: "第1批",
  },
  getters: {
    getData: (state) => state.allData,
  },
  mutations: {
    loadData(state, _data) {
      state.allData = _data;
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
