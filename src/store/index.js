import { createStore } from "vuex";
import axios from "axios";

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
    loadData(state) {
      axios.get("/data/").then((res) => {
        state.allData = res;
      });
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
