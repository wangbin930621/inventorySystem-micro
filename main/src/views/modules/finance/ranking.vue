<template>
  <div class="finance-ranking">
    <button-option/>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="seller_name" label="销售员姓名"></el-table-column>
      <el-table-column prop="shop_name" label="所属门店"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="saleVolume" label="销售量"></el-table-column>
      <el-table-column prop="saleTotal" label="销售额（元）"></el-table-column>
    </el-table>
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
      params: {
        currentPage: 1,
        pageSize: 9999
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
        url: this.$http.adornUrl("/sys/stat/sellerList"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.data;
          this.total = data.data.total
          // this.totalPage = data.page.totalCount;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    handleSizeChange(size) {},
    handleCurrentChange(page) {}
  }
};
</script>

