<template>
  <div class="stock-manage">
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入商品名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-select class="input-width-mini" v-model="params.status" placeholder="商品状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="default" icon="el-icon-search" :loading="isLoading" @click="search">搜索</el-button>
      </div>
      <div class="_button-right">
        <el-button v-if="isAuth('sys:dressProject:save')" type="primary" @click="onAdd">新增</el-button>
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="产品名称" width="180" align="center"></el-table-column>
      <el-table-column prop="image" label="产品照片" width="100" align="center">
        <template slot-scope="scope">
          <el-image
						v-if="scope.row.image && scope.row.image.length > 0"
						style="width: 80px; height: 80px"
						:src="scope.row.image[0]"
						:preview-src-list="scope.row.image">
					</el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="purchase_price" label="进货单价" width="100" align="center"></el-table-column> -->
      <el-table-column prop="price" label="销售单价" width="100" align="center"></el-table-column>
      <el-table-column prop="stock" label="库存" width="180" align="center"></el-table-column>
      <el-table-column prop="factory_name" label="所属厂商" width="180" align="center"></el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="160" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | getStatusString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="产品描述" min-width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:dressProject:update')" type="text" size="small" @click="update(scope.row)">编辑</el-button>
          <el-button v-if="isAuth('sys:dressProject:delete')" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
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
import { status } from "@/utils/status";
import inputImage from "@/components/inputImage";
export default {
  components: {
    buttonOption,
    inputImage
  },
  filters: {
    getStatusString(t) {
      return status(t);
    }
  },
  data() {
    return {
      isLoading: false,
      tableData: [],
      total: 0,
      params: {
        name: "",
        currentPage: 1,
        pageSize: 10
      },
      options: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 2
        }
      ]
    };
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
          this.total = data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    onAdd() {
      this.$router.push("/stock-add");
    },
    update(row) {
      this.$router.push(`/stock-add?id=${row.id}`);
    },
    deleteRow(row) {
      this.$confirm("确认删除当前商品？")
        .then(_ => {
          this.deleteApi(row);
        })
        .catch(_ => {});
    },
    deleteApi(row) {
      this.$http({
        url: this.$http.adornUrl("/sys/dressProject/delete"),
        method: "post",
        data: this.$http.adornData({
          id: row.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "删除商品成功!",
            type: "success"
          });
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

