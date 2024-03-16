<script lang="ts" setup>
import { computed, ref } from "vue";
import { store } from "@/store";
import { Book } from "#/axios";

const show = ref(true);

const emit = defineEmits(["openBookDetail"]);

const detail_data = computed(() => {
  if (!props.id) return { content: "　" };
  else return store.state.books.find((el: Book) => el.id == props.id);
});

const props = defineProps({
  id: String,
});

function open() {
  show.value = true;
}
function close() {
  show.value = false;
}
function openBookDetail() {
  close();
  emit("openBookDetail", props.id);
}

// function getPersonNameById(id: string) {
//   let r = store.state.persons.find((e) => e.id == id);
//   if (r) return r.name;
//   else return "未知人名";
// }
// function getBookNameById(id: string) {
//   let r = store.state.books.find((e) => e.id == id);
//   if (r) return r.name;
//   else return "未知书名";
// }
// function getActionNameById(id: string) {
//   let r = store.state.all_action.find((e) => e.id == id);
//   if (r) return r.name;
//   else return "未知行为";
// }
function getDocumentTypeNameById(id: string) {
  let r = store.state.all_document_type.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}
function getEditionDynastyNameById(id: string) {
  let r = store.state.all_edition_dynasty.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}
function getInstitutionNameById(id: string) {
  let r = store.state.all_institution.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}
function getLanguageNameById(id: string) {
  let r = store.state.all_language.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知语言";
}

defineExpose({
  close,
  open,
});
</script>

<template>
  <div class="book-detail-tooltip" v-show="show">
    <div class="container">
      <div class="content">
        <h4>
          <span v-text="id"></span>
          <span v-text="detail_data.name"></span>
        </h4>
        <div class="detail">
          <p>
            <span>批次：</span>
            <span v-text="'第' + detail_data.batch + '批'"></span>
          </p>
          <p>
            <span>文獻類型：</span>
            <span v-text="getDocumentTypeNameById(detail_data.document_type_id)"></span>
          </p>
          <p>
            <span>文種：</span>
            <span v-text="getLanguageNameById(detail_data.language_id)"></span>
          </p>
          <p>
            <span>版本朝代：</span>
            <span v-text="getEditionDynastyNameById(detail_data.edition_dynasty_id)"></span>
          </p>
          <p>
            <span>收藏單位：</span>
            <span v-text="getInstitutionNameById(detail_data.institution_id)"></span>
          </p>
        </div>
        <span class="to-detail" @click="openBookDetail">查看詳情</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.book-detail-tooltip {
  position: absolute;
  // display: none;
  z-index: 1000;

  .container {
    display: flex;

    .content {
      width: 13rem;
      background-color: #333;
      padding: 1rem;
      color: #efefef;

      h4 {
        font-size: 0.9rem;

        span {
          display: block;
          color: #efefef;
        }
      }

      span.to-detail {
        color: #bbb;
        font-size: 0.7rem;
        text-decoration: underline;
        cursor: pointer;
      }

      .detail {
        font-size: 0.7rem;
        margin: 0.2rem 0 0;
        p {
          color: #ccc;
        }
      }
    }
  }
}
</style>
