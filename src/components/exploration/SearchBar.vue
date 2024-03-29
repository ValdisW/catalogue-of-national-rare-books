<script lang="ts" setup>
import { ref } from "vue";
import Droplist from "@/components/exploration/Droplist.vue";

defineProps({
  attr_list: {
    type: Array,
    required: true,
  },
  wait: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["allAttrSearch", "search"]);

const TextRef = ref(null); // 全字段检索的<input>
const TextSingleRef = ref(null); // 指定字段检索的第一个<input>
const TextMultipleRef = ref(null); // 指定字段检索的后续<input>
const DroplistSingleRef = ref(null);
const DroplistMultipleRef = ref(null);

const n = ref(1);
const all_attr_mode = ref(true);
const show_more_bars = ref(true);
const input_tip = ref(false);

// 全字段检索
function allAttrSearch() {
  // 输入框中有内容才开始检索，否则提示
  if (TextRef.value.value) emit("allAttrSearch", TextRef.value.value);
  else input_tip.value = true;
}

// 指定字段检索
function search() {
  if (TextSingleRef.value) {
    let arr = []; // 用于构建多字段检索的内容
    if (n.value == 1) {
      // 只有一个字段
      arr.push({
        value: TextSingleRef.value.value,
        attr: DroplistSingleRef.value.curr_value,
      });
    } else {
      // 多个字段
      arr.push({
        value: TextSingleRef.value.value,
        attr: DroplistSingleRef.value.curr_value,
      });
      for (let i = 0; i < TextMultipleRef.value.length; i++) {
        arr.push({
          value: TextMultipleRef.value[i].value,
          attr: DroplistMultipleRef.value[i].curr_value,
        });
      }
    }
    console.log(arr);
    emit("search", arr);
  } else input_tip.value = true;
}

// 添加字段
function add() {
  if (n.value < 4) n.value++;
}
</script>

<template>
  <div class="search-bar">
    <div class="toggle-mode">
      <span @click="all_attr_mode = true" :class="{ active: all_attr_mode }"
        >全字段檢索</span
      >
      <span> | </span>
      <span @click="all_attr_mode = false" :class="{ active: !all_attr_mode }"
        >指定字段檢索</span
      >
    </div>
    <div class="content">
      <!-- 全字段检索模式 -->
      <div class="mode" v-if="all_attr_mode">
        <div class="bar-wrapper">
          <input
            placeholder="請輸入關鍵詞"
            type="text"
            ref="TextRef"
            @keyup="
              (e) => {
                if (e.key == 'Enter') allAttrSearch();
              }
            "
          />
        </div>
        <!-- 全字段检索的检索按钮 -->
        <button
          class="search-button"
          :class="{ invalid: wait }"
          @click="if (!wait) allAttrSearch();"
        ></button>
      </div>

      <!-- 指定字段检索模式 -->
      <div class="mode" v-else>
        <button class="add" @click="add">+</button>

        <!-- 第一个字段 -->
        <div class="bar-wrapper">
          <input
            placeholder="請輸入關鍵詞"
            type="text"
            ref="TextSingleRef"
            @keyup="
              (e) => {
                if (e.key == 'Enter') search();
              }
            "
          />
          <Droplist ref="DroplistSingleRef" :attr_list="attr_list" />
        </div>

        <!-- 后续的字段 -->
        <Transition name="fade">
          <TransitionGroup
            name="fade1"
            class="more-bars"
            tag="div"
            v-show="show_more_bars"
          >
            <div class="bar-wrapper" v-for="e in n - 1" :key="e">
              <input
                placeholder="請輸入關鍵詞"
                type="text"
                ref="TextMultipleRef"
                @keyup="
                  (e) => {
                    if (e.key == 'Enter') search();
                  }
                "
              />
              <Droplist ref="DroplistMultipleRef" :attr_list="attr_list" />
            </div>
          </TransitionGroup>
        </Transition>
        <div
          class="hide"
          v-show="n > 1"
          @click="show_more_bars = !show_more_bars"
        ></div>

        <!-- 指定字段检索的检索按钮 -->
        <button
          class="search-button"
          :class="{ invalid: wait }"
          @click="if (!wait) search();"
        ></button>
      </div>
    </div>
  </div>
</template>

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
        background: #f0f0f0 url(../../assets/icons/up.svg) center no-repeat;
        background-size: 40%;
        cursor: pointer;
        position: absolute;
        left: -1.8rem;
        top: 2.4rem;
      }

      button {
        vertical-align: top;
        &:hover {
          filter: brightness(80%);
        }
      }

      button.search-button {
        background: #fbb03b url(../../assets/icons/search.svg) center no-repeat;
        background-size: 66%;
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
      }
      button.search-button.invalid {
        background: #ccc url(../../assets/icons/search.svg) center no-repeat;
        background-size: 66%;
        cursor: unset;
        &:hover {
          filter: unset;
        }
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
    }
  }
}
</style>
