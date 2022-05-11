import { createStore } from 'vuex';
// import { ElMessage } from 'element-plus';
// import * as dataLoader from "@/data/dataLoader";

// const debug = true;

export default createStore({
  state: {
    rem: null,
    batchTitle: '第1批',
  },
  mutations: {
    changeRem(state, payload) {
      state.rem = payload;
    },
    changeBatchTitle(state, payload) {
      
      state.batchTitle = payload;
    },
  },
  actions: {
  },
  modules: {
  }
})
