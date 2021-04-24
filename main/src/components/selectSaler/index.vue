<template>
  <div class="_select-store">
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="username" label="销售员姓名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
      <el-table-column prop="address" label="门店地址"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="select(scope.row)"
            :disabled="scope.row.user_id === id"
          >{{scope.row.user_id === id ? '已选择' : '选择'}}</el-button>
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
export default {
  props: {
    value: [Number, String]
  },
  data() {
    return {
      dialogVisible: false,
      id: "",
      tableData: [],
      isLoading: false,
      total: 0,
      params: {
        name: "",
        phone: "",
        startDate: "",
        endDate: "",
        status: 1,
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  watch: {
    value(id) {
      this.id = id
    },
    id(id) {
      this.$emit("input", id);
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/seller/list"),
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
    select(row) {
      this.id = row.user_id;
      this.$emit("handle-confirm", row);
    },
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getDataList();
    },
    handleCurrentChange(page) {
      this.params.currentPage = page;
      this.getDataList();
    }
  }
};
</script>
