<template>
  <div id="flow">
    <div class="content">
      <div class="section-name">
        <span></span>
        <span>入選名録古籍版本朝代分布</span>
        <span></span>
        <span></span>
      </div>
      <div class="main">
        <!-- 年代选择组件 -->
        <DynastySelector @changeDynastyIDs="changeDynasty" />

        <!-- 暂停/继续 -->
        <div class="togglePause" :class="{ continue: !playing }" @click="togglePause"></div>

        <!-- 画布 -->
        <svg id="particles-svg" ref="particles-svg" @click="togglePause"></svg>

        <!-- 右下角文字 -->
        <div class="comment" v-text="curr_comment"></div>

        <!-- 悬浮窗 -->
        <BookDetailTooltip
          @openBookDetail="$emit('openBookDetail', tooltip_id)"
          ref="book-detail-tooltip"
          :id="tooltip_id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import DynastySelector from "@/components/DynastySelector.vue";
import BookDetailTooltip from "@/components/BookDetailTooltip.vue";

export default {
  name: "FlowingParticles",
  components: {
    DynastySelector,
    BookDetailTooltip,
  },
  watch: {
    playing(n) {
      if (n) this.$refs["book-detail-tooltip"].close();
    },
  },
  data() {
    return {
      max_particles: 250,
      NUM_PARTICLES: 100,
      PARTICLE_SIZE: 0.5, // View heights
      SPEED: 20000, // 毫秒数
      svg: null,
      particles: [],
      animation_handler: null,

      playing: true,

      curr_time: 0,

      particles_original_data: [],

      tooltip_id: "",
      curr_comment: "",
    };
  },
  methods: {
    /**
     * 点击年代名称，切换显示的粒子。
     * 接收子组件传入的对象，包括id列表和要显示的备注
     * @param {Object} o
     */
    changeDynasty(o) {
      this.curr_comment = o.text;

      // 更新粒子数据
      this.particles_original_data = [];
      o.ids.forEach((id) => {
        this.particles_original_data = this.particles_original_data.concat(
          this.$store.state.books.filter((el) => el.edition_dynasty_id == id)
        );
      });

      // 清零
      this.svg.html("");
      this.particles = [];
      this.curr_time = 0;

      // 如果粒子数量太多，只显示其中一部分
      if (this.particles_original_data.length > this.max_particles) {
        let temp_arr = JSON.parse(JSON.stringify(this.particles_original_data));
        this.particles_original_data = [];
        for (let i = 0; i < this.max_particles; i++) this.particles_original_data.push(temp_arr.pop());
      }

      // 生成某数量的粒子
      for (let e of this.particles_original_data) this.particles.push(this.generateParticleData(e));

      // 绘制
      this.svg.selectAll("circle").data(this.particles).enter().append("circle");

      // this.svg.selectAll("circle").on("click", (e, d) => {
      //   event.stopPropagation();
      //   this.$refs["book-detail-tooltip"].$el.style.left = e.clientX + 30 + "px";
      //   this.$refs["book-detail-tooltip"].$el.style.top = e.clientY - 140 + "px";
      //   this.$refs["book-detail-tooltip"].$el.style.display = "block";
      //   this.$refs["book-detail-tooltip"].open();
      //   this.tooltip_id = d.info.id;
      // });

      if (!this.playing) {
        this.animation_handler = requestAnimationFrame(this.draw);
        this.playing = true;
      }
    },
    pause() {
      if (this.playing) {
        cancelAnimationFrame(this.animation_handler);
        this.playing = false;
      }
    },
    continue() {
      if (!this.playing) {
        this.animation_handler = requestAnimationFrame(this.draw);
        this.playing = true;
      }
    },
    togglePause() {
      if (this.playing) this.pause();
      else this.continue();
    },
    normalPool(o) {
      let r = 0;
      do {
        let a = Math.round(this.normal({ mean: o.mean, dev: o.dev }));
        if (a < o.pool.length && a >= 0) return o.pool[a];
        r++;
      } while (r < 100);
    },
    randomNormal(o) {
      if (((o = Object.assign({ mean: 0, dev: 1, pool: [] }, o)), Array.isArray(o.pool) && o.pool.length > 0))
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

    rand(low, high) {
      return Math.random() * (high - low) + low;
    },

    // 根据古籍数据，生成粒子
    generateParticleData(e) {
      const colour = {
        r: 60,
        g: this.randomNormal({ mean: 50, dev: 20 }),
        b: 50,
        a: this.rand(0.2, 0.5),
      };
      return {
        info: e,
        x: -2,
        y: -2,
        diameter:
          0.3 +
          Math.max(
            0,
            this.randomNormal({
              mean: this.PARTICLE_SIZE,
              dev: this.PARTICLE_SIZE / 2,
            })
          ),
        duration: this.randomNormal({
          mean: this.SPEED,
          dev: this.SPEED * 0.1,
        }),
        amplitude: this.randomNormal({ mean: 16, dev: 2 }),
        offsetY: this.randomNormal({ mean: 0, dev: 10 }),
        arc: Math.PI * 2,
        startTime: this.curr_time - this.rand(0, this.SPEED),
        colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
      };
    },

    // 计算粒子的新位置
    moveParticle(particle) {
      const progress = ((this.curr_time - particle.startTime) % particle.duration) / particle.duration;
      return {
        ...particle,
        x: progress,
        y: Math.sin(progress * particle.arc) * particle.amplitude + particle.offsetY,
      };
    },

    // 每帧绘制的内容
    draw() {
      // 动画句柄，用来控制播放
      this.animation_handler = requestAnimationFrame(this.draw);

      // 更新粒子位置数据
      this.particles.forEach((particle, index) => {
        this.particles[index] = this.moveParticle(particle);
      });

      // 根据数据更新粒子位置
      const vh = this.svg.attr("height") / 100;
      this.svg
        .selectAll("circle")
        .data(this.particles)
        .attr("fill", (e) => e.colour)
        .attr("cx", (e) => e.x * this.svg.attr("width"))
        .attr("cy", (e) => e.y * vh + this.svg.attr("height") / 2)
        .attr("r", (e) => e.diameter * vh)
        .attr("cursor", "pointer");

      // 交互
      this.svg
        .selectAll("circle")
        .on("click", (e, d) => {
          this.pause();
          event.stopPropagation();
          this.$refs["book-detail-tooltip"].$el.style.left = e.clientX + 30 + "px";
          this.$refs["book-detail-tooltip"].$el.style.top = e.clientY - 140 + "px";
          this.$refs["book-detail-tooltip"].$el.style.display = "block";
          this.$refs["book-detail-tooltip"].open();
          this.tooltip_id = d.info.id;
        })
        .on("mousemove", (e) => {
          // console.log(e);
        });

      // 计时器
      this.curr_time += 16;
    },
    start() {
      // 配置画布
      this.svg = d3
        .select("#particles-svg")
        .attr("width", window.innerWidth * 0.9)
        .attr("height", window.innerHeight * 0.8);

      // 生成某数量的粒子
      for (let i = 0; i < this.NUM_PARTICLES; i++)
        this.particles_original_data.push(
          this.$store.state.books[Math.floor(Math.random() * this.$store.state.books.length)]
        );

      for (let e of this.particles_original_data) this.particles.push(this.generateParticleData(e));

      // 绘制
      this.svg.selectAll("circle").data(this.particles).enter().append("circle");

      // 动画
      this.draw();
    },
  },

  mounted() {
    if (document.readystate !== "loading") this.start();
    else
      document.addEventListener("DOMContentLoaded", () => {
        this.start();
      });
    this.pause();
  },
  unmounted() {
    cancelAnimationFrame(this.animation_handler);
  },
};
</script>

<style lang="less" scoped>
#flow {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 90%;
    height: 80%;
    display: flex;
    align-items: center;
    .main {
      position: relative;
      border: 0.1rem solid #201d1d;
      .comment {
        position: absolute;
        bottom: 1.5rem;
        left: 1rem;
        font-size: 0.7rem;
      }

      .togglePause {
        user-select: none;
        background: url(../../assets/icons/pause.svg) center no-repeat;
        background-size: 30%;
        border: 0.13rem solid #201d1d;
        cursor: pointer;
        position: absolute;
        right: 2rem;
        bottom: 1.5rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        opacity: 0.6;
      }
      .togglePause.continue {
        background: url(../../assets/icons/continue.svg) center no-repeat;
        background-size: 30%;
      }
    }
  }
}
</style>
