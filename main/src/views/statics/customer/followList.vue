<template>
  <div class="customer-follow-list">
    <div class="search-model">
      <div class="_button-left"></div>
      <div class="_button-right">
        <el-button
          :loading="isLoading"
          @click="onBack"
        >返回客户列表</el-button>
        <el-button
          v-if="isAuth('sys:customer:save')"
          type="primary"
          :loading="isLoading"
          @click="onAdd"
        >新增</el-button>
        <!-- <el-button :loading="isLoading" @click="export">导出Excel</el-button> -->
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <!-- <el-table-column prop="customer_name" label="客户名称" width="180"></el-table-column> -->
      <el-table-column prop="seller_name" label="跟进销售" width="180"></el-table-column>
      <el-table-column prop="remark" label="跟进记录" min-width="250"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:customer:update')"
            type="text"
            size="small"
            @click="update(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="isAuth('sys:customer:delete')"
            type="text"
            size="small"
            @click="deleteRow(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
      id: '',
      params: {
        currentPage: 1,
				pageSize: 10,
				id: ''
			},
      total: 0,
      tableData: []
    };
  },
  mounted() {
		this.params.customer_id = this.$route.query.id
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/customerFollow/list"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.data;
          this.total = data.data.total;
          // this.totalPage = data.page.totalCount;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    onAdd() {
      this.$router.push(`/follow-add?c_id=${this.params.customer_id}`);
    },
    onBack() {
      this.$router.push(`/customer-manage`);
    },
    update(row) {
      this.$router.push(`/follow-add?id=${row.id}&c_id=${this.params.customer_id}`);
    },
    deleteRow(row) {
      this.$confirm("确认删除当前记录？")
        .then(_ => {
          this.deleteApi(row);
        })
        .catch(_ => {});
    },
    deleteApi(row) {
      this.$http({
        url: this.$http.adornUrl("/sys/customerFollow/delete"),
        method: "post",
        data: this.$http.adornData({
          id: row.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
        }
      });
    },
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getDataList();
    },
    handleCurrentChange(page) {
      this.params.currentPage = page;
      this.getDataList();
    },
    search() {
      this.params.currentPage = 1;
      this.getDataList();
    }
  }
};
</script>
