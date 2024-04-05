<script lang="ts" setup>
import { inject, ref, watch } from "vue";
import { Book } from "#/axios";

const show = ref(true);
const inner_id = ref("");
const detail_data = ref<Book>({});

const emit = defineEmits(["openBookDetail"]);
const props = defineProps<{
  position: {
    left: number;
    top: number;
  };
}>();

const introductionData = inject("introductionData").value;
const books = introductionData[0];
const all_edition_dynasty = introductionData[1];
const all_document_type = introductionData[2];
const all_language = introductionData[5];
const all_institution = introductionData[7];
const tooltipRef = ref<HTMLElement | null>();

watch(
  () => props.position,
  () => {
    adjustPosition();
  }
);

function adjustPosition() {
  if (tooltipRef.value) {
    tooltipRef.value.style.left = `${props.position.left}px`;
    tooltipRef.value.style.top = `${props.position.top}px`;
  }
}

function open(id: string) {
  inner_id.value = id;
  if (!inner_id.value) detail_data.value = { content: "　" };
  else detail_data.value = books.find((book: Book) => book.id === inner_id.value);

  show.value = true;
}
function close() {
  show.value = false;
}

function openBookDetail(id: string) {
  close();
  emit("openBookDetail", id);
}

function getDocumentTypeNameById(id: string) {
  let r = all_document_type.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}
function getEditionDynastyNameById(id: string) {
  let r = all_edition_dynasty.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}
function getInstitutionNameById(id: string) {
  let r = all_institution.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}
function getLanguageNameById(id: string) {
  let r = all_language.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知语言";
}

defineExpose({
  close,
  open,
});
</script>

<template>
  <div class="book-detail-tooltip" ref="tooltipRef" v-show="show">
    <div class="container">
      <div class="content">
        <h4>
          <span class="id" v-text="detail_data.id"></span>
          <span class="name" v-text="detail_data.name"></span>
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
        <span class="to-detail" @click="openBookDetail(detail_data.id)">查看詳情</span>
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
          &.id {
            font-size: 0.7rem;
          }
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
        margin: 0.7rem 0 0.4rem;
        p {
          color: #ccc;
        }
      }
    }
  }
}
</style>
