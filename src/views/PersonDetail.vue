<template>
  <div class="person-detail">
    <BackButton />
    <div class="content">
      <div class="person-card">
        <div class="person-info">
          <div class="person-brief">
            <div class="person-name">
              <h1 v-text="$route.params.personID"></h1>
            </div>
            <div class="person-info-list">
              <div class="person-birth">
                <p>生卒：
                  <span>-</span></p>
              </div>
              <div class="person-title" >
                <p>字：
                  <span>-</span>
                </p>
                <p>號：
                  <span>-</span>
                </p>
              </div>
              <p></p>
              <span></span>
            </div>
          </div>
          <div class="person-intro">暫無數據</div>
        </div>

        <div class="related-person">
          <h2 >相關人員</h2>
          <div class="person-responsibility">
            <p v-for="b in this.related_person" :key="b">
              <router-link
                :to="/person-detail/ + b.责任人姓名"
                v-text="b.责任人姓名 + ' ' + b.count"
              ></router-link>

            </p>
          </div>
        </div>
      </div>
      <div class="related-books">
        <div class="responsibility-select">
          <h2>責任目錄</h2>
          <button class="responsibility-type">創作</button>
          <button class="responsibility-type">出版</button>
          <button class="responsibility-type">批較提拔</button>
          <button class="responsibility-type">收藏</button>

        </div>
        <div class="book-responsibility">
          <ul>
            <li v-for="e in relatedBooks" :key="e">
              <router-link
                :to="'/book-detail/' + e.名录ID"
                v-text="e.名录ID + ' ' + e.题名卷数 + ' ' + e.责任行为"
              ></router-link>
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
import BackButton from "@/components/BackButton";

export default {
  name: "PersonDetail",
  components: { BookInfoDialog, BackButton },
  data() {
    return {
      catalogue: {
        创作: [
          "撰",
          "撰文",
          "撰文並書",
          "撰文序",
          "撰文記",
          "撰文並行書",
          "撰序",
          "撰記",
          "集撰",
          "撰集",
          "撰並篆注",
          "撰並注",
          "撰並書",
          "撰並編",
          "撰記並書",
          "撰後記",
          "藏並撰",
          "敕撰",
          "藏幷撰",
          "編撰",
          "輯",
          "釋文",
          "書法",
          "考證",
          "考異",
          "廣義",
          "發明",
          "集覽",
          "正誤",
          "質實",
          "纂集",
        ],
        出版: [
          "抄寫",
          "抄",
          "刻",
          "重刻",
          "修",
          "重修",
          "印",
          "重印",
          "刻版",
          "拓",
          "刻石",
          "刻版 ",
          "補",
          "寫",
          "修補",
          "補刻",
          "續刻",
          "重刻石",
          "印刷",
          "題簽",
          "題跋",
          "題記",
          "摹勒",
          "增修",
          "增刻",
          "刻書牘紙",
          "謙刻",
          "繪",
          "補修",
          "刻石 ",
          "原刻",
          "重刻",
          "刻詩",
        ],
        批校题跋: [
          "題跋",
          "跋",
          "書",
          "題款",
          "題款並跋",
          "題簽並跋",
          "題字",
          "題識",
          "跋並題詩",
          "題詩",
          "題簽",
          "摹勒並題額",
          "題記",
          "題端",
          "題跋題詩題記",
          "題詞",
          "題詩並跋",
          "題詩題詞並跋",
          "批校題識",
          "題簽題記",
          "跋題簽",
          "題跋並題端",
          "題名",
          "畫並題款",
          "書函題簽",
          "題跋及畫",
          "篆書題端",
          "題首",
          "題辭",
          "題簽並題跋",
          "校並題識",
          "題說",
          "批校題跋",
          "題簽並題款",
          "題記並跋",
          "題簽並題記",
          "題識並跋",
          "題簽題記並錄",
          "藏並題簽",
          "跋或題簽",
          "點並題識",
          "抄補並題識",
          "校並跋又題簽",
          "批點並題款",
          "篆首並題識",
          "題記考釋",
          "題記並謄録",
          "校正",
          "校",
          "校並跋",
          "點校",
          "校注",
          "校定",
          "編校",
          "批校",
          "校跋",
          "墨批校",
          "校補",
          "批校並跋",
          "校閱",
          "校點並跋",
          "校補並跋",
          "校跋並錄",
          "批校圈點",
          "批校並錄",
          "增校",
          "校字",
          "校訂",
          "批校並跋又錄",
          "校並跋又錄",
          "重校",
          "校語",
          "校補並錄",
          "校並補序",
          "校記",
          "校證",
          "校釋",
          "校並抄補序目",
          "校並補錄遺詩",
          "評校",
          "簽並批校",
          "校跋並録",
          "批校並跋又録",
          "圈點批校",
          "簽校",
          "校並錄",
          "譯校",
          "補臨並跋",
          "抄補並跋",
          "筆跋",
          "釋文並跋",
          "序並跋",
          "批並跋",
          "注並跋",
          "點並跋",
          "園跋",
          "補志文並跋",
          "跋並録",
          "跋並錄",
          "批點並跋",
          "跋並臨",
          "評並跋",
          "批並錄",
          "批評",
          "批註",
          "批注圈點",
          "批注",
          "批點",
          "批語",
          "批",
          "批選",
          "輯並批點",
          "評注",
          "附注",
          "增注",
          "增註",
          "訓注",
          "簽注",
          "選注",
          "圖注",
          "錄疏注經",
          "注頌",
          "繪並注",
          "輯並注",
          "裁注",
          "注解",
          "輯並評",
          "編注",
          "箋注",
          "補注",
          "編年並注",
          "輯注",
          "書並繪",
          "繪畫",
          "绘图",
          "繪圖",
          "繪製",
          "原繪",
          "輯繪",
          "編繪",
          "註",
          "音註",
          "箋註",
          "補註",
          "註釋",
          "訂註",
          "辯註",
          "纂註",
          "注",
          "注疏",
          "言注",
          "輯錄纂注",
          "集注",
          "標注",
          "音注",
        ],
        收藏: [""],
      },
      relatedBooks: [],
      related_person: [],
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
    };
  },
  mounted() {
    axios
      .get(`/data/person-detail/${this.$route.params.personID}`)
      .then((d) => {
        this.relatedBooks = d.data[0];

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
    color: #3f3937;
    align-items: center;
    justify-content: center;
    .person-card{
      margin-bottom: 30px;
      height: 220px;
      position: relative;
      justify-content: center;
      display: flex;
      margin-top: 100px;
      .person-name{
        width: 150px;
      }
      .person-brief{
        width: 500px;
        display:flex;
        .person-info-list{
          margin-left: 50px;
        }
      }
      .person-intro{
        margin-top: 20px;
      }
      .person-title{
        display: flex;
        p{
          width: 150px;
        }
      }
      .related-person {
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
      margin: 0 auto;
      background: #e7d5bc;
      align-items: center;
      width: 700px;
      height: 400px;

      .responsibility-select{
        display: flex;
        .responsibility-type{
          background: #5e524a;
          border: none;
          width: 80px;
          color:#ffffff;
          height: 40px;
          font-size: 0.7rem;
          margin: 0.5rem 0 0.5rem 0 ;
          margin-left: 20px;
        }
      }
      .book-responsibility {
        overflow-y: scroll;
        height: 330px;
        width: 700px;

        font-size: 0.8rem;
      }
      a {
        color: #000;
      }
    }
  }

}
</style>
