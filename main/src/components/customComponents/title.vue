<template>
  <div class="custom-title">
    <span class="title">标题</span>
    <span class="title-btn">按钮</span>
  </div>
</template>

<script>
export default {
  components: {},
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
  .custom-title {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > .title {
        color: #333333;
        font-size: 18px;
    }
    > .title-btn {
        font-size: 14px;
        color: #999999;
    }
  }
</style>