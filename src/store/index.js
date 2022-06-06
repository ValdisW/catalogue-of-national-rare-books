import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    allData: [],
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
  },
  actions: {},
  modules: {},
});
