<template>
  <div class="mfilter">
    <p class="title" v-text="title"></p>
    <div class="content">
      <ul>
        <li
          v-for="e in attrs"
          :key="e"
          :val="e.value"
          :style="{ width: e.value + 'px' }"
          @click="toggleSelect"
        >
          <span v-text="e.name"></span>
          <span v-text="e.value"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filter",
  props: {
    attrName: Array,
  },
  data() {
    return {};
  },
  computed: {
    attrs: function () {
      let a = JSON.parse(JSON.stringify(this.$store.state[this.attrName]));
      a.forEach((e) => {
        e.value = 130;
      });
      console.log(this.$store.state[this.attrName]);
      return a;
    },
  },
  methods: {
    update(data) {
      return data;
    },
    toggleSelect() {
      console.log("clicked!");
    },
  },
};
</script>

<style lang="less" scoped>
.mfilter {
  background: rgb(153, 135, 105);
  width: 7rem;
  height: 6rem;
  margin: 1rem 0;
  overflow-y: scroll;
  .content {
    ul {
      list-style: none;
      li {
        background: rgb(88, 71, 44);
        color: #fff;
        position: relative;
        margin: 0.1rem 0;
        font-size: 0.6rem;
        cursor: pointer;
      }
    }
  }
}
</style>
