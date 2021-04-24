<template>
  <div class="custom-line">
    <span class="line"></span>
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
  .custom-line {
    height: 20px;
    display: flex;
    align-items: center;
    > .line {
      width: 100%;
      border-top: 1px solid #f1f1f1;
    }
  }
</style>