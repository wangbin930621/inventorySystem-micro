<template>
  <div class="custom-swiper">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <div>
          <img src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00799-2326.jpg" />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <img src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00799-2326.jpg" />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <img src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00799-2326.jpg" />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <img src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00799-2326.jpg" />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <img src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00799-2326.jpg" />
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 180,
        centeredSlides: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
        },
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss'>
.custom-swiper {
  .swiper-container {
    width: 375px;
    height: 144px;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    transition: 300ms;
    transform: scale(0.8);
    position: relative;

    >div{
      width: 300px;
      height: 144px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 5px;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .swiper-slide-active,
  .swiper-slide-duplicate-active {
    transform: scale(1);
    z-index: 99;
  }
}
</style>