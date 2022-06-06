<template>
  <div class="person-detail">
    <h1 v-text="$route.params.personID"></h1>
    <div class="related-books">
      <ul>
        <li
          v-for="e in relatedBooks"
          :key="e"
          v-text="e.名录ID + ' ' + e.题名卷数 + ' ' + e.责任行为"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PersonDetail",
  data() {
    return {
      relatedBooks: [],
    };
  },
  mounted() {
    axios
      .get(`/data/person-detail/${this.$route.params.personID}`)
      .then((d) => {
        this.relatedBooks = d.data;
      });
  },
};
</script>
