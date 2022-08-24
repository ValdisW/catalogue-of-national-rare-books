<template>
  <div class="droplist">
    <div class="box" @click="toggleShowList">
      <span ref="box-text" class="selected" v-text="default_text"></span>
      <span></span>
    </div>
    <ul class="list" v-show="show_list">
      <li
        v-for="attr in attr_list"
        :key="attr"
        @click="select"
        v-text="attr.name"
        :name="attr.value"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Droplist",
  props: {
    attr_list: Array,
  },
  data() {
    return {
      options: [],
      show_list: false,
      default_text: this.attr_list[0].name,
      curr_value: this.attr_list[0].value,
    };
  },
  methods: {
    toggleShowList() {
      this.show_list = !this.show_list;
    },
    select(e) {
      this.curr_value = e.target.getAttribute("name");
      this.toggleShowList();
      this.default_text = e.target.innerText;
    },
  },
};
</script>

<style lang="less" scoped>
.droplist {
  cursor: pointer;
  font-size: 0.7rem;
  display: inline-block;
  width: 4rem;
  height: 2.1rem;
  user-select: none;
  margin-left: -4rem;
  vertical-align: top; // 防错位

  .box {
    height: 100%;
    display: flex;
    align-items: center;
    span:nth-child(2) {
      display: inline-block;
      width: 0;
      height: 0;
      border: 0.3rem solid #000;
      border-bottom-width: 0;
      border-left-color: transparent;
      border-right-color: transparent;
      margin: 0.2rem 0 0 0.2rem;
    }
  }
  .list {
    position: absolute;
    list-style: none;
    background-color: rgba(184, 164, 119, 0.87);
    text-align: center;
    z-index: 10;
    width: 4rem;
    li {
      height: 1.5rem;
      line-height: 1.5rem;
    }
  }
  .list > li:hover {
    background: #333;
    color: #fff;
  }
}
</style>
