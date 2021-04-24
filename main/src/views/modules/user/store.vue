<template>
  <div class="user-store">
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入门店名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-input
          class="input-width-small"
          :placeholder="`请输入电话号码`"
          v-model="params.phone"
          clearable
        ></el-input>
        <el-select class="input-width-mini" v-model="params.status" placeholder="门店状态">
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
        <el-button v-if="isAuth('sys:shop:save')" type="primary" @click="onAdd">新增</el-button>
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="name" label="门店名称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="address" label="门店地址" min-width="180"></el-table-column>
      <el-table-column prop="order_cnt" label="总营业额" width="100"></el-table-column>
      <el-table-column prop="total_cnt" label="总订单数" width="100"></el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | getStatusString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:shop:update')" type="text" size="small" @click="update(scope.row)">编辑</el-button>
          <el-button v-if="isAuth('sys:shop:delete')" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
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
    <el-dialog :title="`${isEdit ? '编辑' : '新增'}门店`" :visible.sync="dialogVisible" width="800px">
      <div>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="门店名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="门店地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item v-if="isEdit" label="审核状态" prop="status">
            <el-radio v-model="form.status" :label="0">禁用</el-radio>
            <el-radio v-model="form.status" :label="1">启用</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import buttonOption from "@/components/buttonOption";
import { status } from "@/utils/status";
export default {
  components: {
    buttonOption
  },
  filters: {
    getStatusString(t) {
      return status(t);
    }
  },
  data() {
    return {
      isLoading: false,
      dialogVisible: false,
      isEdit: false,
      tableData: [],
      total: 0,
      form: {},
      params: {
        name: "",
        phone: "",
        startDate: "",
        endDate: "",
        currentPage: 1,
        pageSize: 10
      },
      rules: {
        name: [
          { required: true, message: "请输入门店名称" },
          { min: 3, max: 25, message: "长度在 3 到 25 个字符" }
        ],
        phone: [
          { required: true, message: "请输入门店电话号码" },
          { max: 25, message: "长度在25个字符" }
        ],
        address: [
          { required: true, message: "请输入门店地址" },
          { min: 3, max: 40, message: "长度在 3 到 40 个字符" }
        ]
      },
      options: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 2
        },
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
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getDataList();
    },
    handleCurrentChange(page) {
      this.params.currentPage = page;
      this.getDataList();
    },
    update(row) {
      this.isEdit = true;
      this.form = row;
      this.dialogVisible = true;
    },
    onAdd() {
      this.isEdit = false;
      this.form = {};
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.isEdit ? this.editSave() : this.addSave();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteRow(row) {
      this.$confirm("确认删除当前门店？")
        .then(_ => {
          this.deleteApi(row)
        })
        .catch(_ => {});
    },
    deleteApi(row) {
      this.$http({
        url: this.$http.adornUrl("/sys/shop/delete"),
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
    addSave() {
      this.$http({
        url: this.$http.adornUrl("/sys/shop/save"),
        method: "post",
        data: this.$http.adornData(this.form)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          this.form = {};
          this.$message({
            message: "添加成功",
            type: "success"
          });
        }
      });
    },
    editSave() {
      this.$http({
        url: this.$http.adornUrl("/sys/shop/update"),
        method: "post",
        data: this.$http.adornData(this.form)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          this.form = {};
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      });
    },
    search() {
      this.params.currentPage = 1;
      this.getDataList();
    }
  }
};
</script>

