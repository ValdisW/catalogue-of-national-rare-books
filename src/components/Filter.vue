<template>
  <div class="filter">
    <p class="title" v-text="attr_name"></p>
    <div class="content">
      <ul>
        <li v-for="e in attrs" :key="e" :val="e.value" @click="toggleSelect(e)">
          <div class="bar" :style="{ width: e.value + 'px' }"></div>
          <div class="info">
            <span v-text="e.name"></span>
            <span v-text="e.value"></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filter",
  props: {
    attr_id: String,
    attr_name: String,
    attrs: Array,
  },
  methods: {
    update(data) {
      return data;
    },
    toggleSelect(e) {
      this.$emit("filter", { attr: this.attr_id, value: e.name });
    },
  },
};
</script>

<style lang="less" scoped>
.filter {
  background: rgb(153, 135, 105);
  width: 7rem;
  height: 6rem;
  margin: 1rem 0;
  overflow-y: scroll;
  overflow-x: hidden;
  .content {
    ul {
      list-style: none;
      li {
        color: #fff;
        position: relative;
        margin: 0.1rem 0;
        font-size: 0.6rem;
        cursor: pointer;
        position: relative;
        .bar {
          background: rgb(88, 71, 44);
          height: 1rem;
        }
        .info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: absolute;
          top: 0;
        }
      }
    }
  }
}
</style>
