<template>
  <div id="flow">
    <BookInfoDialog
      ref="book-info-dialog"
      :id="hover_data.id"
      :title="hover_data.title"
      :detail="hover_data.detail"
    />
  </div>
</template>

<script>
const d3 = require("d3");
import * as Data from "@/data/dataLoader";
import BookInfoDialog from "@/components/BookInfoDialog";

export default {
  name: "FlowingParticles",
  components: { BookInfoDialog },
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
      var r = 0;
      do {
        var a = Math.round(this.normal({ mean: o.mean, dev: o.dev }));
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
      var r,
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

      let start_id = Math.round(rate * this.NUM_PARTICLES);
      let _left = start_id;
      let _right = start_id > this.PER_NUM ? start_id - this.PER_NUM : 0;

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
        .data(this.point_attribute.filter((d, i) => i >= _right && i <= _left))
        .join("circle")
        .on("mouseenter", (d, i, a) => {
          this.$refs["book-info-dialog"].style.display = "block";
          console.log(a[i]);
          // this.hover_data = {
          //   id: data.名录ID,
          //   title: this.$store.state.allData.find((elem) => elem.id == data.名录ID).content.split("　")[0],
          //   detail: this.$store.state.allData.find((elem) => elem.id == data.名录ID).detail,
          // };
        })
        .attr("class", (d, i) => `point-${i + _left}`)
        .style("cursor", "pointer")
        .transition()
        .duration(1e2 * Math.abs(rate - rate_old))
        .attr("fill", (d) => d.color)
        .attr("r", (d) => d.radius)
        .attr("cx", (d, i) => {
          const progress =
            ((i + rate * this.NUM_PARTICLES) % this.PER_NUM) / this.PER_NUM;
          return progress * width;
        })
        .attr("cy", (d, i) => {
          let attr = this.point_attribute[i];
          const progress =
            ((i + rate * this.NUM_PARTICLES) % this.PER_NUM) / this.PER_NUM;
          let y = Math.sin(progress * attr.arc) * attr.amplitude + attr.offsetY;
          return y * this.vh + height / 2;
        });

      this.flow
        .selectAll("circle")
        .on("click", (e, d) => {
          console.log(d);
          this.$router.push(`/book-detail/${d.id}`);
        })
        // .on("mouseenter", () => (this.$refs["book-info-dialog"].$el.style.display = "block"))
        .on("mousemove", (ev) => {
          this.$refs["book-info-dialog"].$el.style.left =
            ev.clientX + 10 + "px";
          this.$refs["book-info-dialog"].$el.style.top =
            ev.clientY - 120 + "px";
        })
        .on("mouseenter", (ev, data) => {
          this.$refs["book-info-dialog"].$el.style.display = "block";
          console.log(this.$refs["book-info-dialog"]);
          this.hover_data = {
            id: data.id,
            title: this.$store.state.allData
              .find((elem) => elem.id == data.id)
              .content.split("　")[0],
            detail: this.$store.state.allData.find((elem) => elem.id == data.id)
              .detail,
          };
        })
        .on("mouseleave", () => {
          this.$refs["book-info-dialog"].$el.style.display = "none";
        });
    },
    initializePointAttribute() {
      this.point_attribute = [];
      for (let d of this.$store.state.allData) {
        let offsetY = this.randomNormal({ mean: 0, dev: 10 });
        let amplitude = this.randomNormal({ mean: 16, dev: 2 });
        let arc = Math.PI * 2;
        this.point_attribute.push({
          id: d.id,
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
      console.log(Data.get_data().book_info);
      this.NUM_PARTICLES = this.$store.state.allData.length;
      this.PER_NUM = Math.round(this.NUM_PARTICLES / 20);

      this.initializePointAttribute();

      d3.select(this.$el).selectAll("svg").remove();
      this.svg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      this.flow = this.svg.append("g").attr("id", "points");

      // this.removeTooltip();

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

      // this.drawTooltip();
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
  top: 20vh;
  width: 100vw;
  height: 65vh;
}
</style>
