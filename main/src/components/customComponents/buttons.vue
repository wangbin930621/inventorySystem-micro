<template>
  <div class="custom-buttons">
    <div class="btn-label">
      <div class="btn-label-img">
        <img src="../../assets/img/default_img.png" />
      </div>
      <span>按钮一</span>
    </div>
    <div class="btn-label">
      <div class="btn-label-img">
        <img src="../../assets/img/default_img.png" />
      </div>
      <span>按钮一</span>
    </div>
    <div class="btn-label">
      <div class="btn-label-img">
        <img src="../../assets/img/default_img.png" />
      </div>
      <span>按钮一</span>
    </div>
    <div class="btn-label">
      <div class="btn-label-img">
        <img src="../../assets/img/default_img.png" />
      </div>
      <span>按钮一</span>
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
  .custom-buttons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > .btn-label {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;
      .btn-label-img {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        > img {
          width: 32px;
          height: 32px;
          object-fit: cover;
        }
      }
      > span {
        margin-top: 5px;
      }
    }
  }
</style>