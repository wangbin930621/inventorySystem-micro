<template>
  <div class="finance-statistics">
    <el-radio-group v-model="params.type" style="margin-bottom: 20px">
      <el-radio-button :label="1">月度</el-radio-button>
      <el-radio-button :label="2">年度</el-radio-button>
    </el-radio-group>
    <br>
    <div class="search-model">
      <div class="_button-left">
        <el-date-picker
          v-model="params.value"
          value-format="yyyyMM"
          type="month"
          placeholder="请输入年度/季度">
        </el-date-picker>
        <el-button type="default" icon="el-icon-search" :loading="isLoading" @click="search">搜索</el-button>
      </div>
      <div class="_button-right">
        <el-button v-if="isAuth('sys:report:save')" type="primary" @click="onAdd">新增</el-button>
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="code" label="编号"></el-table-column>
      <el-table-column prop="name" label="报表名称"></el-table-column>
      <el-table-column prop="year_month" label="月度"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editReport(scope.row)">查看报表</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import buttonOption from "@/components/buttonOption";
export default {
  components: {
    buttonOption
  },
  data() {
    return {
      isLoading: false,
      status: 1,
      params: {
        type: 1,
        value: '',
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/report/list"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.data;
          this.total = data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    onAdd() {
      this.$router.push('/statistics-add')
    },
    search() {
      this.params.currentPage = 1;
      this.getDataList()
    },
    editReport(row) {
      this.$router.push(`/statistics-add?id=${row.code}`)
    },
    handleSizeChange(size) {
      this.params.pageSize = size
      this.getDataList()
    },
    handleCurrentChange(page) {
      this.params.currentPage = page
      this.getDataList()
    }
  }
};
</script>

