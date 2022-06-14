<template>
  <router-view v-slot="{ Component }" :key="$route.fullPath">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
// import BookDetail from "@/components/BookDetail";
// import PersonDetail from "@/components/PersonDetail";
// import InstitutionDetail from "@/components/InstitutionDetail";

export default {
  name: "App",
  // components: { BookDetail, PersonDetail, InstitutionDetail },
  mounted() {
    this.$store.commit("loadData");
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html {
  font-size: 20px;
  overflow-y: hidden;
  background-color: #f2e0c4;
}
</style>
