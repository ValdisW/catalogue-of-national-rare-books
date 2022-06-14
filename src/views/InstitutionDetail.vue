<template>
  <div class="institution-detail">
    <BackButton />
    <div class="content">
      <h1>国家图书馆</h1>
      <p>
        国家图书馆前身是筹建于1909年9月9日的京师图书馆，1998年更名为国家图书馆。该馆收藏古籍200万册件，其中善本古籍27万册件。宋元善本、敦煌遗书、赵城金藏、永乐大典、四库全书、方志家谱等是其特色藏品，另有金石拓片、舆图、少数民族语文等特藏古籍。专用古籍书库5个，总面积8493平方米。
        由古籍馆全面管理，工作人员130余人，专设典藏阅览、文献保护、古籍特藏修复等机构管理、保护、修复古籍。
      </p>
      <ul>
        <li v-for="t in temp" :key="t" v-text="t.id + ' ' + t.content"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BackButton from "@/components/BackButton.vue";

export default {
  name: "InstitutionDetail",
  components: { BackButton },
  data() {
    return {
      temp: [],
    };
  },
  mounted() {
    axios
      .get(`/data/institution-detail/${this.$route.params.institutionID}`)
      .then((d) => {
        this.temp = d.data;
      });
  },
};
</script>

<style lang="less" scoped>
.institution-detail {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
