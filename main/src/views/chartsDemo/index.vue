<template>
  <div class="chart-demo" ref="chart"></div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  methods: {
    init() {
      const dom = this.$refs.chart;
      const myChart = echarts.init(dom, 'light');
      myChart.setOption(this.options);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style></style>
<style lang="scss" scoped>
.chart-demo {
  height: 100%;
  width: 100%;
}
</style>
