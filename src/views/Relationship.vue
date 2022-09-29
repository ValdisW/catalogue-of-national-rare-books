<template>
  <div class="relationship">
    <div class="search">
      <div>
        <label for="person-name">人物名稱：</label>
        <input id="person-name" type="text" v-model="person_name" ref="text" />
      </div>
      <div>
        <label for="min-books">最少相關數：</label>
        <input id="min-books" type="text" v-model="min_books" ref="text" />
      </div>
      <button id="search-button" @click="search"></button>
    </div>
    <div class="result">
      <div>
        <span
          class="person-name"
          v-for="e in result_persons"
          :key="e"
          v-text="$store.state.persons.find((el) => el.id == e.id).name + ' '"
          @click="test(e.id)"
        ></span>
      </div>

      <div>
        <span
          class="book-name"
          v-for="e in result_books"
          :key="e"
          v-text="
            $store.state.persons.find((el) => el.id == e.person_id).name +
            '(' +
            e.count +
            ')' +
            ' '
          "
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "2333",
  data() {
    return {
      person_name: "黄",
      min_books: 2,

      result_persons: [],
      result_books: [],
    };
  },
  methods: {
    search() {
      axios
        .get(`/data/get-person-by-keyword?kwd=${this.person_name}`)
        .then((res) => {
          this.result_persons = res.data;
        });
    },
    test(id) {
      axios
        .get(
          `/data/related-persons?personID=${id}&minRelations=${this.min_books}`
        )
        .then((res) => {
          this.result_books = res.data;
        });
    },
  },
  mounted() {
    axios.get("/data/relationship-load").then((res) => {
      this.$store.commit("loadRelationshipData", res.data);

      this.complete = true;
      this.$emit("endLoading");

      this.search();
    });
  },
  unmounted() {
    this.$emit("startLoading");
  },
};
</script>

<style lang="less" scoped>
.relationship {
  width: 100vw;
  height: 100vh;
  padding: 3rem 5rem;
  box-sizing: border-box;
  display: flex;
  div.search {
    input[type="text"] {
      height: 2rem;
      width: 15rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      outline: none;
      vertical-align: top; // 防错位
    }
    #search-button {
      background: #fbb03b url(../assets/icons/search.svg) center no-repeat;
      background-size: 66%;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      margin: 0 0 0 0.7rem;
    }
  }
}
</style>
