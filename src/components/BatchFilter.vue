<template>
  <div class="container">
    <div class="batch-selector">
      <div class="selector-description">
        <span>Select Batch</span>
      </div>
      <el-select
        class="select-filter"
        v-model="curSelect"
        filterable
        default-first-option
        placeholder="第1批"
        @change="handleSelectChange($event)"
      >
        <el-option
          v-for="item in allBatches"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import * as Data from "@/data/dataLoader";
import {mapState} from 'vuex';

export default {
  name: "BatchFilter",
  data() {
    return {
      curSelect: null,
      options: null,
      // title: null,
    }
  },
  computed: {
    ...mapState(["batchTitle"]),
    allBatches() {
        return Data.get_batch_info();
    },
    title() {
      return this.curSelect;
    }
  },
  watch: {
    batchTitle: {
      // handler: function(newVal, oldVal) {

      // }
    },
    batchInfo(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  methods: {
    handleSelectChange() {
      this.$store.commit("changeBatchTitle", this.curSelect);
    }
  },
  created() {
    this.curSelect = '第1批';
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">

.select-filter {
  margin: 15px;
}

.tag-container {
  margin-top: 10px;
  padding: 0 40px;
}

.el-tag {
  user-select: none;
  cursor: pointer;
  font-size: 18px;
  border: #DDDDDD solid 1px;
  margin: 3px;
}

.container {
  position: relative;
  height: 100%;
  width: calc(100% - 2rem);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
}

// .image {
//   // width: 10%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;

//   img {
//     height: 90%;
//     padding-left: 10%;
//   }
// }


.batch-selector {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .selector-description {
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    span {
      font-size: 0.8rem;
    }
  }
}
</style>
