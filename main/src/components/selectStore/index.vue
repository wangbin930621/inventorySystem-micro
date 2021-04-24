<template>
  <div class="_select-store">
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="name" label="门店名称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="address" label="门店地址"></el-table-column>
      <el-table-column label="操作" width="80" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="select(scope.row)"
            :disabled="scope.row.id === id"
          >{{scope.row.id === id ? '已选择' : '选择'}}</el-button>
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
    id(value) {
      this.$emit('input', value)
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/shop/list"),
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
      this.id = row.id;
      this.$emit("input", this.id);
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
