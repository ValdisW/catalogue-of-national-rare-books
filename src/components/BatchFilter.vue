<template>
  <div class="container">
    <span @click="decreaseBatch" style="cursor: pointer;">- </span>
    <span>{{batchTitle}}</span>
    <span @click="addBatch" style="cursor: pointer;"> +</span>
  </div>
</template>

<script>
import * as Data from "@/data/dataLoader";

export default {
  name: "BatchFilter",
  data() {
    return {
      batchTitle: null,
    }
  },
  computed: {
  },
  watch: {
    // batchTitle: {
    //   // handler: function(newVal, oldVal) {

    //   // }
    // },
  },
  methods: {
    decreaseBatch() {
      if (this.batchTitle!='第1批') {
        let i = Number(this.batchTitle[1])-1;
        this.batchTitle = "第"+i+"批";
      }
      this.$emit("batchChanged", this.batchTitle)
    },
    addBatch() {
      if (this.batchTitle!='第6批') {
        let i = Number(this.batchTitle[1])+1;
        this.batchTitle = "第"+i+"批";
      }
      this.$emit("batchChanged", this.batchTitle)
    }
    // handleSelectChange() {
    //   this.$store.commit("changeBatchTitle", this.curSelect);
    // }
  },
  created() {
    this.batchTitle = '第1批';
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">

</style>
