<template>
  <div class="page-divider">
    <div class="prev-and-next">
      <li class="prev-page" @click="prevPage">上一页</li>
      <li class="next-page" @click="nextPage">下一页</li>
    </div>
    <div class="all-pages">
      <li
        class="page-index"
        v-for="i in pages_sum"
        :key="i"
        @click="turnTo"
        :class="{ is_current_page: i == current_page }"
      >
        {{ i }}
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageDivider",
  computed: {
    pages_sum: function () {
      return Math.ceil(this.items_sum / this.each_page_items);
    },
  },
  data: function () {
    return {
      current_page: 1,
    };
  },
  props: {
    items_sum: Number,
    each_page_items: Number,
  },
  methods: {
    prevPage() {
      this.current_page -= 1;
      this.$emit("turnTo", this.current_page);
    },
    nextPage() {
      this.current_page += 1;
      this.$emit("turnTo", this.current_page);
    },
    turnTo(e) {
      this.current_page = e.target.innerText;
      this.$emit("turnTo", this.current_page);
    },
  },
};
</script>

<style scoped>
/* .page-divider > div::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.page-divider > div {
  zoom: 1;
} */
.prev-page,
.next-page {
  display: inline-block;
}
.page-divider li {
  list-style-type: none;
  text-decoration: none;
  margin: 0.5vmax;
  min-width: 1.5vmax;
  padding: 0.3vmax;
  border-radius: 0.2vmax;
  text-align: center;
  background: #4a3300;
  font-size: 1vmax;
  /* position: relative; */
  display: inline-block;
  cursor: pointer;
  color: #ccc;
}
.page-divider li.is_current_page {
  background-color: rgb(212, 172, 62);
}
.page-divider li:hover {
  filter: brightness(130%);
}
</style>
