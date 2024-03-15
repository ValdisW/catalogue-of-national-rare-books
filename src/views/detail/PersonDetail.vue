<template>
  <div class="person-detail" v-show="show">
    <div class="content">
      <div class="close-button" @click="close"></div>

      <!-- 页面上半部分内容 -->
      <div class="person-card">
        <div class="person-info">
          <div class="person-brief">
            <div class="person-name">
              <h1 v-text="person_data.name"></h1>
            </div>
            <div class="person-info-list">
              <div class="person-birth">
                <p>
                  生卒：
                  <span v-text="`${person_data.year_of_birth} - ${person_data.year_of_death}`"></span>
                </p>
              </div>
              <div class="person-title">
                <p>字:<span v-text="person_data.courtesy_name || '不詳'"></span></p>
                <p>
                  號:
                  <span v-text="person_data.pseudonym_name || '不詳'"></span>
                </p>
              </div>
              <p></p>
              <span></span>
            </div>
          </div>
          <div class="person-intro" v-text="person_data.introduction || ''"></div>
        </div>

        <div class="related-person">
          <h4>相關人物</h4>
          <div class="person-responsibility">
            <p
              v-for="b in related_person"
              :key="b.person_id"
              @click="openPersonDetail(b.person_id)"
              v-text="store.state.persons.find((ele) => ele.id == b.person_id)!.name + '（' + b.count + '）'"
            ></p>
            <!-- <router-link
                :to="/person-detail/ + b.person_id"
                v-text="$store.state.persons.find((ele) => ele.id == b.person_id).name + '（' + b.count + '）'"
              ></router-link> -->
          </div>
        </div>
      </div>

      <div class="related-books">
        <div class="responsibility-select">
          <h4>責任目録</h4>
          <button
            v-for="n in action_types"
            :key="n.name"
            v-text="`${n.name}(${n.count})`"
            class="responsibility-type"
            :class="{ invalid: !n.count }"
            @click="if (n.count) filterType(n.name);"
          ></button>
        </div>
        <div class="book-responsibility">
          <ul>
            <li v-for="e in filtered_related_books" :key="e" @click="emit('openBookDetail', e.book_id)">
              <span v-text="e.book_id + ' '"></span>
              <span v-text="e.title + ' '"></span>
              <span v-text="e.action + ' '"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <BookInfoDialog ref="book-info-dialog" :id="hover_data.id" :title="hover_data.title" :detail="hover_data.detail" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import BookInfoDialog from "@/components/BookInfoDialog.vue";
import { Relation, RelatedPerson } from "#/axios";

import { store } from "@/store";
import { getPersonDetailData } from "@/api";

const emit = defineEmits(["openPersonDetail", "openBookDetail"]);

const show = ref(false); // 控制本组件是否显示

const related_person = <RelatedPerson[]>reactive([]); // 相关的其他人物
const all_related_books = <Relation[]>reactive([]); // 该人物的所有相关书籍
const filtered_related_books = <Relation[]>reactive([]); // 创作/出版/批校题跋/收藏的相关书籍筛选结果

// 实际没用上
const hover_data = reactive({
  id: "",
  title: "",
  detail: "",
});

// 用来呈现人物信息
const person_data = ref({
  name: "加載中",
  year_of_birth: "",
  year_of_death: "",
  courtesy_name: "-",
  pseudonym_name: "-",
  introduction: "-",
});

// 该人物以各种形式参与的书籍统计
const action_types = reactive([
  { name: "創作", count: 0 },
  { name: "出版", count: 0 },
  { name: "批校題跋", count: 0 },
  { name: "收藏", count: 0 },
]);

function init() {
  // 动作分类归零
  action_types.forEach((e) => (e.count = 0));

  // 清空相关的人物、书籍
  related_person.length = 0;
  all_related_books.length = 0;
  filtered_related_books.length = 0;
}

function close() {
  show.value = false;
}

function openPersonDetail(person_id: string) {
  // emit("openPersonDetail", person_id);
  open(person_id);
}

function open(person_id: string) {
  init();

  show.value = true;

  getPersonDetailData(person_id).then((d) => {
    person_data.value = { ...d.data[0][0] };

    filtered_related_books.push(...d.data[1]);
    all_related_books.push(...d.data[1]);

    related_person.push(...d.data[2]);
    related_person.sort((a, b) => b.count - a.count);

    // for (let e of this.all_related_books) e.type = this.$store.state.all_action.find((el) => el.id == e.action_id).type;
    for (let e of action_types) for (let f of all_related_books) if (e.name == f.type) e.count++;
  });
}

// 筛选
function filterType(type: string) {
  filtered_related_books.length = 0;
  filtered_related_books.push(...all_related_books.filter((el) => el.type == type));
}

defineExpose({ open, close });
</script>

<style lang="less" scoped>
.person-detail {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  background: #f0e9dd;

  .content {
    width: 70%;
    position: relative;
    align-items: center;
    justify-content: center;
    .close-button {
      position: absolute;
      left: -3rem;
      top: 0.5rem;
      width: 2rem;
      height: 2rem;
      background: url(../../assets/icons/back.svg) center no-repeat;
      background-size: 100%;
      cursor: pointer;
    }

    .person-card {
      margin-bottom: 1.5rem;
      height: 11rem;
      position: relative;
      display: flex;
      justify-content: space-between;
      .person-info {
        margin: 0 1rem 0 0;
        .person-brief {
          width: 25rem;
          display: flex;
          align-items: flex-start;
          overflow: hidden;
          .person-name {
            min-width: 7.5rem;
          }
          .person-info-list {
            white-space: nowrap;
            margin: 0.4rem 0 0 1rem;
            height: fit-content;
            font-size: 0.8rem;
            .person-birth {
              display: flex;
              p {
                font-weight: bold;
                span {
                  font-weight: normal;
                }
              }
            }
            .person-title {
              display: flex;
              p {
                font-weight: bold;
                margin: 0 1rem 0 0;
                span {
                  font-weight: normal;
                }
              }
            }
          }
        }
        .person-intro {
          margin-top: 1rem;
          font-size: 0.7rem;
          height: 7rem;
          overflow-y: scroll;
        }
      }

      .related-person {
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: #3331;
        display: flex;
        flex-direction: column;
        a {
          color: #201d1d;
        }
        .person-responsibility {
          position: relative;
          font-size: 0.7rem;
          width: 10rem;
          overflow-y: scroll;
          p {
            cursor: pointer;
            &:hover {
              background: #3331;
            }
          }
        }
      }
    }
    .related-books {
      padding: 0.5rem;
      border-radius: 0.5rem;
      margin: 0 auto;
      background: #3331;
      align-items: center;
      .responsibility-select {
        display: flex;
        .responsibility-type {
          background: #5e524a;
          border-radius: 0.3rem;
          border: none;
          padding: 0 0.5rem;
          color: #ffffff;
          height: 1.3rem;
          font-size: 0.7rem;
          margin: 0.1rem 0 0.5rem 20px;
          cursor: pointer;
          &:hover {
            filter: brightness(80%);
          }
        }

        .responsibility-type.invalid {
          cursor: unset;
          opacity: 0.5;
          &:hover {
            filter: none;
          }
        }
      }
      .book-responsibility {
        overflow-y: scroll;
        height: 15rem;
        font-size: 0.8rem;
        ul {
          li {
            cursor: pointer;
            padding: 0.1rem 0;
            span:first-child {
              color: rgb(168, 124, 79);
            }
            span:last-child {
              background: rgba(63, 40, 82, 0.413);
              color: #eee;
              padding: 0 0.1rem;
              border-radius: 0.1rem;
            }
          }
          li:hover {
            background: #3331;
          }
        }
      }
      a {
        color: #201d1d;
      }
    }
  }
}
</style>
