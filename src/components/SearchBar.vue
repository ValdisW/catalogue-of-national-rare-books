<template>
  <div class="search-bar">
    <!-- 添加高级检索字段 -->
    <button class="add" @click="add">+</button>

    <div class="bar-wrapper">
      <input placeholder="請輸入關鍵詞" type="text" ref="text-single" />
      <Droplist ref="drop-list-single" :attr_list="attr_list" />
    </div>

    <div class="more-bars" v-show="show_more_bars">
      <div class="bar-wrapper" v-for="e in n - 1" :key="e">
        <input placeholder="請輸入關鍵詞" type="text" ref="text-multiple" />
        <Droplist ref="drop-list-multiple" :attr_list="attr_list" />
      </div>
    </div>
    <div class="hide" v-show="n > 1" @click="show_more_bars = !show_more_bars"></div>

    <!-- 检索按鈕 -->
    <button class="search-button" @click="search"></button>
  </div>
</template>

<script>
import Droplist from "@/components/Droplist";

export default {
  name: "SearchBar",
  components: { Droplist },
  props: {
    attr_list: Array,
  },
  data() {
    return {
      n: 1,
      show_more_bars: true,
    };
  },
  methods: {
    search() {
      console.log(document.querySelectorAll(".text"), this.$refs.text);
      let arr = [];
      if (this.n == 1) {
        arr.push({
          value: this.$refs["text-single"].value,
          attr: this.$refs["drop-list-single"].curr_value,
        });
      } else {
        arr.push({
          value: this.$refs["text-single"].value,
          attr: this.$refs["drop-list-single"].curr_value,
        });
        for (let i = 0; i < this.$refs["text-multiple"].length; i++) {
          arr.push({
            value: this.$refs["text-multiple"][i].value,
            attr: this.$refs["drop-list-multiple"][i].curr_value,
          });
        }
      }
      this.$emit("search", arr);
    },
    add() {
      if (this.n < 4) this.n++;
    },
  },
};
</script>

<style lang="less" scoped>
.search-bar {
  display: flex;
  align-items: center;
  position: relative;
  .bar-wrapper {
    // display: inline-block;
    margin: 0 0.7rem;
    input[type="text"] {
      padding: 0 0 0 0.3rem;
      height: 2rem;
      width: 15rem;
      border: 0.1rem solid #000;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      outline: none;
      vertical-align: top; // 防错位
    }
  }
  .more-bars {
    position: absolute;
    left: 2rem;
    top: 2.2rem;
    z-index: 100;
    .bar-wrapper {
      margin: 0.3rem 0 0 0;
    }
  }
  .hide {
    width: 3rem;
    height: 1rem;
    background: red;
    cursor: pointer;
  }

  button {
    vertical-align: top;
  }

  button.search-button {
    background: #fbb03b url(../assets/icons/search.svg) center no-repeat;
    background-size: 66%;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
  }
  button.add {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    // margin: 0 0 0 0.7rem;
  }

  button:hover {
    filter: brightness(80%);
  }
}
</style>
