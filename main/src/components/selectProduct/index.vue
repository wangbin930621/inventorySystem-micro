<template>
  <div class="_select-store">
    <div class="search-model" style="margin-bottom: 10px;">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入商品名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-button type="default" icon="el-icon-search" :loading="isLoading" @click="search">搜索</el-button>
      </div>
    </div>
    <el-table
      ref="selectTable"
      :data="tableData"
      v-loading="isLoading"
      border
      style="width: 100%"
      @select="selectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="产品名称" width="180"></el-table-column>
      <el-table-column prop="image" label="产品照片" width="100" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.image && scope.row.image.length > 0"
            style="width: 80px; height: 80px"
            :src="scope.row.image[0]"
            :preview-src-list="scope.row.image"
          ></el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="purchase_price" label="进货单价" width="100" align="center"></el-table-column> -->
      <el-table-column prop="price" label="销售单价" width="100" align="center"></el-table-column>
      <el-table-column prop="stock" label="库存" width="180" align="center"></el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="160" align="center"></el-table-column>
      <el-table-column prop="remark" label="产品描述" min-width="180" align="center"></el-table-column>
      <!-- <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="select(scope.row)"
            :disabled="scope.row.id === id"
          >{{scope.row.id === id ? '已选择' : '选择'}}</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      id: [],
      selectRow: [],
      tableData: [],
      isLoading: false,
      total: 0,
      params: {
        startDate: "",
        endDate: "",
        status: 1,
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  watch: {
    value: {
      handler(id) {
        this.id = id
        console.log(this.id)
      },
      immediate: true
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
        url: this.$http.adornUrl("/sys/dressProject/list"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.data;
          this.$nextTick(() => {
            this.tableData.forEach(row => {
              if (this.id.indexOf(row.id) >= 0) {
                this.$refs.selectTable.toggleRowSelection(row, true);
              }
            });
          });
          this.total = data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    selectionChange(selection, row) {
      const ids = selection.map(item => item.id)
      if(ids.indexOf(row.id) > -1) {
        this.id.push(row.id);
        this.selectRow.push(row)
      } else {
        const index = this.id.indexOf(row.id)
        this.id.splice(index, 1)
        this.selectRow.splice(index, 1)
      }
      console.log('this.id: ', this.id)
      console.log('this.selectRow: ', this.selectRow)
      this.$emit("handle-confirm", this.selectRow);
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
