<template>
  <div class="user-factory">
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入供应商名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-input
          class="input-width-small"
          :placeholder="`请输入手机号`"
          v-model="params.phone"
          clearable
        ></el-input>
        <el-select class="input-width-mini" v-model="params.status" placeholder="供应商状态">
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
        <el-button v-if="isAuth('sys:factory:save')" type="primary" @click="onAdd">新增</el-button>
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="name" label="供应商名称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="address" label="供应商地址" min-width="180"></el-table-column>
      <el-table-column prop="no_send_cnt" label="待寄件订单数" width="120"></el-table-column>
      <el-table-column prop="send_cnt" label="已寄件订单数" width="120"></el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | getStatusString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:factory:update')" type="text" size="small" @click="update(scope.row)">编辑</el-button>
          <el-button v-if="isAuth('sys:factory:delete')" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog :title="`${isEdit ? '编辑' : '新增'}生产`" :visible.sync="dialogVisible" width="800px">
      <div>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="生产名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="生产地址" prop="address">
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
      isEdit: false,
      dialogVisible: false,
      tableData: [],
      params: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      form: {},
      rules: {
        name: [
          { required: true, message: "请输入生产名称", trigger: "blur" },
          { min: 3, max: 25, message: "长度在 3 到 25 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入生产电话号码", trigger: "blur" },
          { max: 25, message: "长度在25个字符", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入生产地址", trigger: "blur" },
          { min: 3, max: 40, message: "长度在 3 到 40 个字符", trigger: "blur" }
        ]
      },
      options: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
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
        url: this.$http.adornUrl("/sys/factory/list"),
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
          this.deleteApi(row);
        })
        .catch(_ => {});
    },
    deleteApi(row) {
      this.$http({
        url: this.$http.adornUrl("/sys/factory/delete"),
        method: "post",
        data: this.$http.adornData({
          id: row.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    addSave() {
      this.$http({
        url: this.$http.adornUrl("/sys/factory/save"),
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
      // const { id, status = 1, phone, name, address } = this.form;
      // const params = Object.assign(
      //   {},
      //   {
      //     id,
      //     status,
      //     phone,
      //     name,
      //     address
      //   }
      // );
      this.$http({
        url: this.$http.adornUrl("/sys/factory/update"),
        method: "post",
        data: this.$http.adornData(this.form)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          this.form = {};
          this.$message({
            message: "编辑成功",
            type: "success"
          });
        }
      });
    },
    onAdd() {
      this.isEdit = false;
      this.form = {};
      this.dialogVisible = true;
    },
    update(row) {
      this.isEdit = true;
      this.form = row;
      this.dialogVisible = true;
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

