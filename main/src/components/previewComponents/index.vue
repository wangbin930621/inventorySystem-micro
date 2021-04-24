<template>
  <div class="preview-components">
    <Draggable
      v-model="list"
      class="draggable-div"
      element="div"
      group="people"
      animation="300"
      ghostClass="ghost"
      :style="{ height: `${height}px` }"
    >
      <component
        v-for="(item, index) in list"
        :is="item.component"
        :data="item.data"
        :key="`${item.component}_${index}`"
      />
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  components: {
    Draggable,
    Swiper: () => import('@/components/customComponents/swiper'),
    Search: () => import('@/components/customComponents/search'),
    Buttons: () => import('@/components/customComponents/buttons'),
    Blank: () => import('@/components/customComponents/blank'),
    AuxiliaryLine: () => import('@/components/customComponents/line'),
    Title: () => import('@/components/customComponents/title'),
    Group: () => import('@/components/customComponents/group'),
    List: () => import('@/components/customComponents/list'),
  },
  data() {
    return {
      height: 0,
      list: [],
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.height = document.body.clientHeight - 162;
  },
  methods: {},
};
</script>
<style lang='scss'>
  .preview-components {
    width: 375px;
    margin-left: 40px;
    box-shadow: 1px 1px 10px #dedede;
    overflow: hidden;
    padding-bottom: 20px;
    box-sizing: border-box;
    .draggable-div{
      overflow-y: auto;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        display:none;
      }
    }
    .ghost{
      width: 100%;
      height: 100px;
      border: 1px dashed red;
      color: red;
      text-align: center;
      line-height: 100px;
      box-sizing: border-box;
      margin: 0;
    }
  }
</style>