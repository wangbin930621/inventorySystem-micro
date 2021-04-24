<template>
  <div class="shop-index">
    <!-- 基础组件 -->
    <Base-Components />
    <!-- 页面预览 -->
    <Preview-Components />
  </div>
</template>

<script>
import BaseComponents from '@/components/baseComponents';
import PreviewComponents from '@/components/previewComponents';

export default {
  components: {
    BaseComponents,
    PreviewComponents,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss'>
.shop-index {
  display: flex;
}
</style>