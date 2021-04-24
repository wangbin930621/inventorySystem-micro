<template>
  <div class="base-components" :style="{ height: `${height}px` }">
    <Draggable
      v-model="list"
      class="draggable-div"
      element="div"
      :sort="false"
      :group="{ name: 'people', pull: 'clone', put: false }"
    >
      <div v-for="(item, index) in list" :key="index">
        <span :class="['iconfont', item.icon]"></span>
        <span>{{ item.name }}</span>
      </div>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  components: {
    Draggable,
  },
  data() {
    return {
      height: 0,
      list: [
        {
          name: '搜索',
          icon: 'icon-RectangleCopy',
          component: 'Search',
        },
        {
          name: '标题',
          icon: 'icon-biaoti',
          component: 'Title',
        },
        {
          name: '辅助线',
          icon: 'icon-fuzhuxian',
          component: 'AuxiliaryLine',
        },
        {
          name: '图文导航',
          icon: 'icon-daohang1',
          component: 'Buttons',
        },
        {
          name: '轮播图',
          icon: 'icon-lunbotu',
          component: 'Swiper',
        },
        {
          name: '自由布局',
          icon: 'icon-bujuliebiao2',
          component: 'Layout',
        },
        {
          name: '间隔空白',
          icon: 'icon-fengekongbai',
          component: 'Blank',
        },
        {
          name: '产品列表',
          icon: 'icon-liebiao',
          component: 'List',
        },
        {
          name: '推荐分组',
          icon: 'icon-fenzu',
          component: 'Group',
        }
      ],
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
  .base-components{
    width: 224px;
    border-right: 1px dashed #c5c5c5;
    overflow-x: auto;
    .draggable-div {
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 82px;
        height: 82px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        border: 1px solid #cbcbcb;
        border-radius: 15px;
        margin: 10px;
        > span {
          &:first-child {
            font-size: 30px;
          }
        }
      }
    }
  }
</style>