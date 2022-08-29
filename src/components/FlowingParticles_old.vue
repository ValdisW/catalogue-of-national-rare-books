<template>
  <div id="flow">
    <!-- <div>
        <p>《国家珍贵古籍名录》是由国务院批准发布的我国现存珍贵古籍目录。</p>
        <p>
          2007年，国务院办公厅发布《关于进一步加强古籍保护工作的意见》，启动了“中华古籍保护计划”。其中一项重要任务，就是建立《国家珍贵古籍名录》，实现国家对古籍的分级管理和保护，目的是要建立完备的珍贵古籍档案，确保珍贵古籍的安全。入选典籍为国内存世古籍中具有代表性的精品，且在《国家珍贵古籍名录》评审过程中，一些珍贵古籍的新品种、新版本、新价值被陆续发现。
        </p>
        <p>
          目前，国务院已批准公布六批《国家珍贵古籍名录》，全国487家机构/个人收藏的13026部古籍入选，囊括先秦两汉至明清时期的汉文古籍、少数民族文字古籍和其他文字古籍。
        </p>
      </div> -->
    <BookDetailTooltip
      ref="book-detail-tooltip"
      :id="hover_data.id"
      :title="hover_data.title"
      :detail="hover_data.detail"
    />
  </div>
</template>

<script>
const d3 = require("d3");
import * as Data from "@/data/dataLoader";
import BookDetailTooltip from "@/components/BookDetailTooltip";

export default {
  name: "FlowingParticles",
  components: { BookDetailTooltip },
  props: ["rate", "canvasWidth", "canvasHeight"],
  data() {
    return {
      NUM_PARTICLES: Number,
      PARTICLE_SIZE: 0.6,
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
    };
  },
  watch: {
    rate: function (newVal, oldVal) {
      this.drawPoints(newVal, oldVal, this.canvasWidth, this.canvasHeight);
    },
  },
  methods: {
    // modified version of random-normal
    normalPool(o) {
      let r = 0;
      do {
        let a = Math.round(this.normal({ mean: o.mean, dev: o.dev }));
        if (a < o.pool.length && a >= 0) return o.pool[a];
        r++;
      } while (r < 100);
    },
    randomNormal(o) {
      if (
        ((o = Object.assign({ mean: 0, dev: 1, pool: [] }, o)),
        Array.isArray(o.pool) && o.pool.length > 0)
      )
        return this.normalPool(o);
      let r,
        a,
        n,
        e,
        l = o.mean,
        t = o.dev;
      do r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
      while (r >= 1);
      return (e = a * Math.sqrt((-2 * Math.log(r)) / r)), t * e + l;
    },
    getColor() {
      let colour = {
        r: 60,
        g: this.randomNormal({ mean: 50, dev: 20 }),
        b: 50,
        a: Math.random(),
      };
      return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
    },
    getRadius() {
      let r = this.randomNormal({
        mean: this.PARTICLE_SIZE,
        dev: this.PARTICLE_SIZE / 2,
      });
      return (Math.max(0, r) + 0.3) * this.vh;
    },
    drawPoints(rate, rate_old, width, height) {
      // this.flow.selectAll('circle')
      //     .attr('cx', -2)
      //     .attr('cy', -2)
      // let size = this.flow.selectAll("circle").size();

      // let start_id = Math.round(rate * this.NUM_PARTICLES);
      let index_coming = Math.round(rate * this.NUM_PARTICLES); // rate对应的index，刚刚进入画面的点的index（左端）
      let index_leaving =
        index_coming > this.PER_NUM ? index_coming - this.PER_NUM : 0; // 即将离开画面的点的index（右端）
      // let left, right;
      // if (rate > rate_old) {
      //   // 向后
      //   left = Math.round(rate_old * this.NUM_PARTICLES);
      //   right = start_id + this.PER_NUM;
      // } else {
      //   // 向前
      //   left = start_id;
      //   right = Math.round(rate_old * this.NUM_PARTICLES) + this.PER_NUM;
      // }
      // left -= this.PER_NUM;
      // right += this.PER_NUM;
      // if (left < 0) left = 0;
      // if (right > this.NUM_PARTICLES) right = this.NUM_PARTICLES;

      this.flow
        .selectAll("circle")
        .data(
          this.point_attribute.filter(
            (d, i) => i >= index_leaving && i <= index_coming
          )
        )
        .join("circle")
        .attr("class", (d, i) => `point-${i + index_leaving}`)
        .style("cursor", "pointer")
        .transition()
        .duration(1e2 * Math.abs(rate - rate_old))
        .attr("fill", (d) => d.color)
        .attr("r", (d) => d.radius)
        .attr("cx", (d) => {
          // console.log(d);
          // const progress = i / this.PER_NUM;
          // return (1 - progress) * width;
          const progress =
            ((d.index + rate * this.NUM_PARTICLES) % this.PER_NUM) /
            this.PER_NUM;
          return progress * width;
        })
        .attr("cy", (d, i) => {
          let attr = this.point_attribute[i];
          const progress =
            ((d.index + rate * this.NUM_PARTICLES) % this.PER_NUM) /
            this.PER_NUM;
          let y = Math.sin(progress * attr.arc) * attr.amplitude + attr.offsetY;
          return y * this.vh + height / 2;
        });

      this.flow.selectAll("circle").on("click", (e, d) => {
        // this.$router.push(`/book-detail/${d.id}`);
        this.$refs["book-detail-tooltip"].$el.style.left =
          e.clientX + 30 + "px";
        this.$refs["book-detail-tooltip"].$el.style.top =
          e.clientY - 140 + "px";
        this.$refs["book-detail-tooltip"].$el.style.display = "block";
        this.hover_data = {
          id: d.id,
          title: this.$store.state.books.find((elem) => elem.id == d.id).name,
          detail: this.$store.state.books.find((elem) => elem.id == d.id)
            .detail,
        };
      });
      // .on("mouseleave", () => {
      //   this.$refs["book-detail-tooltip"].$el.style.display = "none";
      // });
    },
    initializePointAttribute() {
      this.point_attribute = [];
      for (let i in this.$store.state.books) {
        let offsetY = this.randomNormal({ mean: 0, dev: 10 });
        let amplitude = this.randomNormal({ mean: 16, dev: 2 });
        let arc = Math.PI * 2;
        this.point_attribute.push({
          index: i,
          id: this.$store.state.books[i].id,
          color: this.getColor(),
          radius: this.getRadius(),
          offsetY: offsetY,
          amplitude: amplitude,
          arc: arc,
        });
      }
    },
    initializeFlow(width, height) {
      this.vh = height / 100;

      this.book_list = Object.keys(Data.get_data().book_info);
      this.NUM_PARTICLES = this.$store.state.books.length;
      this.PER_NUM = Math.round(this.NUM_PARTICLES / 20);

      this.initializePointAttribute();

      d3.select(this.$el).selectAll("svg").remove();
      this.svg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      this.flow = this.svg.append("g").attr("id", "points");
      // this.points = this.flow.selectAll('circle')
      //     .data(this.book_list)
      //     .join('circle')
      //     .attr("fill", ()=>{
      //             let colour = {
      //                 r: 255,
      //                 g: this.randomNormal({ mean: 125, dev: 20 }),
      //                 b: 50,
      //                 a: this.rand(0, 1),
      //             };
      //             return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
      //         })
      //     .attr("class", (d,i)=>`point-${i}`)
      //     .style("cursor","pointer")
      //     .attr('r', ()=>{
      //         let r=this.randomNormal({
      //             mean: this.PARTICLE_SIZE,
      //             dev: this.PARTICLE_SIZE / 2,
      //         })
      //         return Math.max(0,r)*self.vh
      //     })
      //     .attr('cx', width+10)
      //     .attr('cy', height/2)
    },
  },
  mounted() {
    this.initializeFlow(this.canvasWidth, this.canvasHeight);
  },
};
</script>

<style lang="less" scoped>
#flow {
  position: absolute;
  top: 13vh;
  width: 100vw;
  height: 65vh;
}
</style>
