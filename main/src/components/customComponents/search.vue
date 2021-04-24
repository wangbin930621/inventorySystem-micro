<template>
  <div class="custom-search">
    <span class='iconfont icon-RectangleCopy'></span>
    <input placeholder="请输入要搜索的产品" />
    <span class='iconfont icon-tishi'></span>
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
.custom-search {
  margin: 0px 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  > .icon-RectangleCopy {
    font-size: 26px;
  }
  > .icon-tishi {
    font-size: 22px;
  }
  > input {
    width: 100%;
    padding: 10px 8px;
    border: 0;
    outline: none;
  }
}
</style>