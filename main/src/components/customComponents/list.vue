<template>
  <div class="custom-list">
    <div>
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg"
      >
    </div>
    <div>
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg"
      >
    </div>
    <div>
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg"
      >
    </div>
    <div>
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg"
      >
    </div>
    <div>
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg"
      >
    </div>
    <div>
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg"
      >
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
  methods: {}
};
</script>
<style lang='scss'>
.custom-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    > div {
        width: calc(50% - 5px);
        margin-bottom: 10px;
        > img {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }
    }
}
</style>