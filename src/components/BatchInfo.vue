<template>
  <div class="batch-info" v-show="display" :style="{ left, top }">
    <div class="arrow"></div>
    <div class="content">批次内容什么的</div>
  </div>
</template>

<script>
export default {
  name: "BatchInfo",
  props: {
    display: Boolean,
    left: Number,
    top: Number,
  },
};
</script>

<style lang="less" scoped>
.batch-info {
  position: absolute;
  .arrow {
  }
  .content {
    background: #333;
    color: #fff;
  }
}
</style>
