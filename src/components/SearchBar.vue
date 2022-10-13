<template>
  <div class="search-bar">
    <div class="toggle-mode">
      <span @click="all_attr_mode = true" :class="{ active: all_attr_mode }">全字段檢索</span>
      <span> | </span>
      <span @click="all_attr_mode = false" :class="{ active: !all_attr_mode }">指定字段檢索</span>
    </div>
    <div class="content">
      <div class="mode" v-if="all_attr_mode">
        <div class="bar-wrapper">
          <input placeholder="請輸入關鍵詞" type="text" ref="text" />
        </div>
        <button class="search-button" @click="allAttrSearch"></button>
      </div>
      <div class="mode" v-else>
        <button class="add" @click="add">+</button>

        <div class="bar-wrapper">
          <input placeholder="請輸入關鍵詞" type="text" ref="text-single" />
          <Droplist ref="drop-list-single" :attr_list="attr_list" />
        </div>

        <!-- <div class="more-bars" v-show="show_more_bars"> -->
        <Transition name="fade">
          <TransitionGroup name="fade1" class="more-bars" tag="div" v-show="show_more_bars">
            <div class="bar-wrapper" v-for="e in n - 1" :key="e">
              <input placeholder="請輸入關鍵詞" type="text" ref="text-multiple" />
              <Droplist ref="drop-list-multiple" :attr_list="attr_list" />
            </div>
          </TransitionGroup>
        </Transition>
        <!-- </div> -->
        <div class="hide" v-show="n > 1" @click="show_more_bars = !show_more_bars"></div>

        <button class="search-button" @click="search"></button>
      </div>
    </div>
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
      all_attr_mode: true,
      show_more_bars: true,
    };
  },
  methods: {
    search() {
      // console.log(document.querySelectorAll(".text"), this.$refs.text);
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
    allAttrSearch() {
      this.$emit("allAttrSearch", this.$refs["text"].value);
    },
    add() {
      if (this.n < 4) this.n++;
    },
  },
};
</script>

<style lang="less" scoped>
.fade1-enter-active {
  transition: all 0.5s;
}

.fade1-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
.search-bar {
  .toggle-mode {
    margin: 0 0 0.2rem;
    span {
      cursor: pointer;
      font-size: 0.7rem;
      color: #68563a88;
    }
    span:nth-child(2) {
      color: #68563a;
    }
    span.active {
      color: #68563a;
    }
  }
  .content {
    .mode {
      display: flex;
      align-items: center;
      position: relative;
      .bar-wrapper {
        margin: 0 0.7rem 0 0;
        input[type="text"] {
          padding: 0 0 0 0.3rem;
          height: 2rem;
          width: 15rem;
          border: 0.1rem solid #201d1d;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          outline: none;
          vertical-align: top; // 防错位
        }
      }
      .more-bars {
        position: absolute;
        top: 2.2rem;
        z-index: 100;
        .bar-wrapper {
          margin: 0.3rem 0 0 0;
        }
      }
      .hide {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50%;
        background: #f0f0f0 url(../assets/icons/up.svg) center no-repeat;
        background-size: 40%;
        cursor: pointer;
        position: absolute;
        left: -1.8rem;
        top: 2.4rem;
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
        left: -1.8rem;
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        position: absolute;
        // margin: 0 0 0 0.7rem;
      }

      button:hover {
        filter: brightness(80%);
      }
    }
  }
}
</style>
