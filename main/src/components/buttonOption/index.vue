<template>
  <div class="_button-option">
    <div class="_button-left">
      <el-date-picker
        v-if="buttonArray.indexOf('date') > -1"
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select v-if="buttonArray.indexOf('select') > -1" v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-if="buttonArray.indexOf('text') > -1"
        class="input-width-middle"
        :placeholder="inputPlaceholder"
        v-model="inputValue"
        clearable
      ></el-input>
      <el-button v-if="buttonArray.indexOf('search') > -1" type="default" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button v-if="buttonArray.indexOf('add') > -1" type="primary" @click="add">新增</el-button>
      <el-button v-if="buttonArray.indexOf('export') > -1" @click="exportExcel">导出Excel</el-button>
    </div>
    <div class="_button-right"></div>
  </div>
</template>
<script>
export default {
  props: {
    buttonArray: {
      type: Array,
      default() {
        return [];
      }
    },
    selectList: {
      type: Array,
      default() {
        return [];
      }
    },
    inputPlaceholder: {
      type: String,
      default: '请输入内容'
    }
  },
  data() {
    return {
      time: "",
      selectValue: "",
      inputValue: "",
      options: [
        {
          label: "test",
          value: "test"
        }
      ],
      form:{
        time: [],
        selectValue: '',
        inputValue: ''
      }
    };
  },
  methods: {
    search() {
      this.$emit('on-search', this.selectList)
    },
    add() {
      this.$emit('on-add')
    },
    exportExcel() {
      this.$emit('on-exportExcel')
    }
  }
};
</script>
<style lang="scss">
._button-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  ._button-left {
    > div {
      margin-bottom: 10px;
    }
  }
}
</style>

