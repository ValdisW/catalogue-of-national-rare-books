<template>
  <div class="person-detail" v-show="show">
    <!-- <BackButton /> -->
    <div class="content">
      <div class="close-button" @click="close"></div>
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
              v-for="b in this.related_person"
              :key="b"
              @click="openPersonDetail(b.person_id)"
              v-text="$store.state.persons.find((ele) => ele.id == b.person_id).name + '（' + b.count + '）'"
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
            @click="filterType(n.name)"
          ></button>
        </div>
        <div class="book-responsibility">
          <ul>
            <li v-for="e in filtered_related_books" :key="e" @click="$emit('openBookDetail', e.book_id)">
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

<script>
import axios from "axios";
import BookInfoDialog from "@/components/BookInfoDialog";

export default {
  name: "PersonDetail",
  components: { BookInfoDialog },
  data() {
    return {
      show: false,
      all_related_books: [],
      filtered_related_books: [],
      related_person: [],
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
      person_data: {},
      action_types: [],
    };
  },
  methods: {
    init() {
      this.action_types = [
        { name: "創作", count: 0 },
        { name: "出版", count: 0 },
        { name: "批校題跋", count: 0 },
        { name: "收藏", count: 0 },
      ];

      this.person_data = {
        name: "加載中",
        year_of_birth: "",
        year_of_death: "",
        courtesy_name: "-",
        pseudonym_name: "-",
        introduction: "-",
      };

      this.related_person = [];
      this.filtered_related_books = [];
    },
    close() {
      this.show = false;
    },
    open(person_id) {
      this.show = true;

      this.init();

      axios.get(`/data/person-detail/${person_id}`).then((d) => {
        this.person_data = d.data[0][0];
        this.filtered_related_books = this.all_related_books = d.data[1];
        this.related_person = d.data[2];
        this.related_person.sort((a, b) => b.count - a.count);

        for (let e of this.all_related_books)
          e.type = this.$store.state.all_action.find((el) => el.id == e.action_id).type;
        for (let e of this.action_types) for (let f of this.all_related_books) if (e.name == f.type) e.count++;
      });
    },
    filterType(type) {
      this.filtered_related_books = this.all_related_books.filter((el) => el.type == type);
    },
  },
};
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
      background: url(../assets/icons/back.svg) center no-repeat;
      background-size: 100%;
      cursor: pointer;
    }

    .person-card {
      margin-bottom: 1.5rem;
      height: 11rem;
      position: relative;
      display: flex;
      justify-content: space-between;
      .person-name {
        width: 7.5rem;
      }
      .person-brief {
        width: 25rem;
        display: flex;
        align-items: center;
        .person-info-list {
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
      .related-person {
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: #3331;
        a {
          color: #201d1d;
        }
        .person-responsibility {
          position: relative;
          font-size: 0.7rem;
          width: 200px;
          height: 170px;
          overflow-y: scroll;
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
        }
        .responsibility-type:hover {
          filter: brightness(80%);
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
            background: #5e524a4c;
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
