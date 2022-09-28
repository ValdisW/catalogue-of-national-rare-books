<template>
  <div class="person-detail">
    <!-- <BackButton /> -->
    <div class="content">
      <div class="person-card">
        <div class="person-info">
          <div class="person-brief">
            <div class="person-name">
              <h1 v-text="person_info.name"></h1>
            </div>
            <div class="person-info-list">
              <div class="person-birth">
                <p>
                  生卒：
                  <span
                    v-text="
                      `${person_info.year_of_birth} - ${person_info.year_of_death}`
                    "
                  ></span>
                </p>
              </div>
              <div class="person-title">
                <p>
                  字：
                  <span v-text="person_info.courtesy_name || '不詳'"></span>
                </p>
                <p>
                  號：
                  <span v-text="person_info.pseudonym_name || '不詳'"></span>
                </p>
              </div>
              <p></p>
              <span></span>
            </div>
          </div>
          <div
            class="person-intro"
            v-text="person_info.introduction || '暫無數據'"
          ></div>
        </div>

        <div class="related-person">
          <h4>相關人物</h4>
          <div class="person-responsibility">
            <p v-for="b in this.related_person" :key="b">
              <router-link
                :to="/person-detail/ + b.person_id"
                v-text="
                  $store.state.persons.find((ele) => ele.id == b.person_id)
                    .name +
                  ' ' +
                  b.count
                "
              ></router-link>
            </p>
          </div>
        </div>
      </div>

      <div class="related-books">
        <div class="responsibility-select">
          <h4>責任目録</h4>
          <button class="responsibility-type">創作</button>
          <button class="responsibility-type">出版</button>
          <button class="responsibility-type">批校題跋</button>
          <button class="responsibility-type">收藏</button>
        </div>
        <div class="book-responsibility">
          <ul>
            <li v-for="e in relatedBooks" :key="e">
              <span v-text="e.book_id + ' '"></span>
              <span
                v-text="e.title + ' '"
                @click="$emit('openBookDetail', e.book_id)"
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <BookInfoDialog
      ref="book-info-dialog"
      :id="hover_data.id"
      :title="hover_data.title"
      :detail="hover_data.detail"
    />
  </div>
</template>

<script>
import axios from "axios";
// import * as d3 from "d3";
import BookInfoDialog from "@/components/BookInfoDialog";

export default {
  name: "PersonDetail",
  components: { BookInfoDialog },
  data() {
    return {
      relatedBooks: [],
      related_person: [],
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
      person_info: {},
    };
  },
  mounted() {
    // this.person_info = {
    //   name: this.$store.state.persons.find(
    //     (ele) => ele.id == this.$route.params.personID
    //   ).name,
    // };
    this.person_info = this.$store.state.persons.find(
      (ele) => ele.id == this.$route.params.personID
    );

    axios
      .get(`/data/person-detail/${this.$route.params.personID}`)
      .then((d) => {
        this.relatedBooks = d.data[0];
        console.log(this.relatedBooks, this.$store.state.all_action);
        this.related_person = d.data[1];
        this.related_person.sort((a, b) => b.count - a.count);
        let max = 0,
          min = Number.POSITIVE_INFINITY;
        for (let p of this.related_person) {
          if (max > p.count) max = p.count;
          if (min < p.count) min = p.count;
        }
        // let rp = d3.select(".related-person");
        // rp.selectAll("div")
        //   .data(this.related_person)
        //   .enter()
        //   .append("div")
        //   .style("width", "16px")
        //   .style("height", "16px")
        //   .style("border-radius", "50%")
        //   .style("background", "#4a330066")
        //   .style("display", "inline-block")
        //   .style("cursor", "pointer")
        //   .style("margin", "2px")
        //   .style("position", "absolute")
        //   .style(
        //     "left",
        //     (e, i, a) =>
        //       `${
        //         250 +
        //         (200 - e.count * 10) * Math.cos(((Math.PI * 2) / a.length) * i)
        //       }px`
        //   )
        //   .style(
        //     "top",
        //     (e, i, a) =>
        //       `${
        //         250 +
        //         (200 - e.count * 10) * Math.sin(((Math.PI * 2) / a.length) * i)
        //       }px`
        //   )
        //   .on("click", (e, d) => {
        //     this.$router.push(`/person-detail/${d.责任人姓名}`);
        //   })
        //   .on("mousemove", (ev) => {
        //     this.$refs["book-info-dialog"].$el.style.left =
        //       ev.clientX + 10 + "px";
        //     this.$refs["book-info-dialog"].$el.style.top =
        //       ev.clientY + 30 + "px";
        //   })
        //   .on("mouseenter", (ev, data) => {
        //     ev.target.style.background = "#da9f21";
        //     this.$refs["book-info-dialog"].$el.style.display = "block";
        //     this.hover_data = {
        //       title: data.责任人姓名,
        //     };
        //   })
        //   .on("mouseleave", (ev) => {
        //     ev.target.style.background = "#4a330066";
        //     this.$refs["book-info-dialog"].$el.style.display = "none";
        //   });
      });
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
  .content {
    width: 80%;

    align-items: center;
    justify-content: center;
    .person-card {
      margin-bottom: 1.5rem;
      height: 11rem;
      position: relative;
      justify-content: center;
      display: flex;
      margin-top: 5rem;
      .person-name {
        width: 7.5rem;
      }
      .person-brief {
        width: 25rem;
        display: flex;
        .person-info-list {
          // margin-left: 2.5rem;
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
      }

      .related-person {
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: #e7d5bc;
        a {
          color: #000;
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
      background: #e7d5bc;
      align-items: center;
      width: 41rem;
      height: 18rem;

      .responsibility-select {
        display: flex;
        .responsibility-type {
          background: #5e524a;
          border-radius: 0.3rem;
          border: none;
          width: 80px;
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
        height: 330px;
        width: 700px;

        font-size: 0.8rem;
        ul {
          li {
            cursor: pointer;
            span:first-child {
              color: rgb(168, 124, 79);
            }
          }
          li:hover {
            background: #5e524a4c;
          }
        }
      }
      a {
        color: #000;
      }
    }
  }
}
</style>
