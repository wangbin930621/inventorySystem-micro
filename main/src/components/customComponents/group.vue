<template>
  <div class="custom-group">
    <div>
      <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg" />
    </div>
    <div>
        <div>
          <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg" />
        </div>
        <div>
          <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg" />
        </div>
    </div>
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
  // 1+2
  .custom-group {
    display: flex;
    align-items: center;
    height: 226px;
    > div {
      flex: 1;
      &:first-child {
        padding-left: 10px;
        height: 100%;
      }
      &:last-child {
        padding: 0 10px;
        > div {
          &:first-child {
            margin-bottom: 10px;
          }
        }
      }
    }
    div {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
</style>