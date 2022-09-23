<template>
  <div id="flow">
    <DynastySelector @changeDynastyIDs="test" />
    <div class="pause" @click="pause"></div>

    <svg id="particles-svg" ref="particles-svg" @click="pause"></svg>

    <div class="comment">
      <p>*金、遼、蒙古入宋</p>
    </div>

    <BookDetailTooltip
      @openBookDetail="$emit('openBookDetail', hover_id)"
      ref="book-detail-tooltip"
      :id="hover_id"
    />
  </div>
</template>

<script>
import * as d3 from "d3";
import DynastySelector from "@/components/DynastySelector.vue";
import BookDetailTooltip from "@/components/BookDetailTooltip";

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
      max_particles: 300,
      NUM_PARTICLES: 100,
      PARTICLE_SIZE: 0.5, // View heights
      SPEED: 20000, // 毫秒数
      svg: null,
      particles: [],
      animation_handler: null,

      playing: true,

      curr_time: 0,

      particles_original_data: [],

      hover_id: "",
    };
  },
  methods: {
    test(ids) {
      // 更新粒子数据
      this.particles_original_data = [];
      ids.forEach((id) => {
        this.particles_original_data = this.particles_original_data.concat(
          this.$store.state.books.filter((el) => el.edition_dynasty_id == id)
        );
      });

      // 清零
      this.svg.html("");
      this.particles = [];
      this.curr_time = 0;

      if (this.particles_original_data.length > this.max_particles) {
        let temp_arr = JSON.parse(JSON.stringify(this.particles_original_data));
        this.particles_original_data = [];
        for (let i = 0; i < this.max_particles; i++)
          this.particles_original_data.push(temp_arr.pop());
      }

      // 生成某数量的粒子
      for (let e of this.particles_original_data)
        this.particles.push(this.generateParticleData(e));

      // 绘制
      this.svg
        .selectAll("circle")
        .data(this.particles)
        .enter()
        .append("circle");

      this.svg.selectAll("circle").on("click", (e, d) => {
        event.stopPropagation();
        this.$refs["book-detail-tooltip"].$el.style.left =
          e.clientX + 30 + "px";
        this.$refs["book-detail-tooltip"].$el.style.top =
          e.clientY - 140 + "px";
        this.$refs["book-detail-tooltip"].$el.style.display = "block";
        this.$refs["book-detail-tooltip"].open();
        this.hover_id = d.info.id;
      });
    },
    pause() {
      if (this.playing) cancelAnimationFrame(this.animation_handler);
      else this.animation_handler = requestAnimationFrame(this.draw);

      this.playing = !this.playing;
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
      const progress =
        ((this.curr_time - particle.startTime) % particle.duration) /
        particle.duration;
      return {
        ...particle,
        x: progress,
        y:
          Math.sin(progress * particle.arc) * particle.amplitude +
          particle.offsetY,
      };
    },

    draw() {
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

      // 计时器
      this.curr_time += 17;
    },
    reset() {},
    init() {},
    start() {
      // 配置画布
      this.svg = d3
        .select("#particles-svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

      // 生成某数量的粒子
      for (let i = 0; i < this.NUM_PARTICLES; i++)
        this.particles.push(this.generateParticleData());

      // 绘制
      this.svg
        .selectAll("circle")
        .data(this.particles)
        .enter()
        .append("circle");

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
  position: relative;

  .comment {
    position: absolute;
    bottom: 2rem;
    left: 1rem;

    p {
      font-size: 0.7rem;
    }
  }

  .pause {
    user-select: none;
    background: rgb(108, 108, 108);
    cursor: pointer;
    position: absolute;
    right: 3rem;
    bottom: 5rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
}
</style>
