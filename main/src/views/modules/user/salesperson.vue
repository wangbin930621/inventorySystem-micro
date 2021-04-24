<template>
  <div class="user-salesperson">
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入销售员名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-input
          class="input-width-small"
          :placeholder="`请输入手机号`"
          v-model="params.phone"
          clearable
        ></el-input>
        <el-select class="input-width-mini" v-model="params.status" placeholder="销售员状态">
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
        <el-button v-if="isAuth('sys:seller:save')" type="primary" @click="onAdd">新增</el-button>
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="username" label="销售员名称" width="200">
        <template slot-scope="scope">
          <span>
            {{ scope.row.username }}
            <el-tag v-if="scope.row.kind === 4">店长</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120" align="center"></el-table-column>
      <el-table-column prop="shop_name" label="所属门店" min-width="180" align="center"></el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="160" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | getStatusString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:seller:update')"
            type="text"
            size="small"
            @click="update(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="isAuth('sys:seller:delete')"
            type="text"
            size="small"
            @click="deleteRow(scope.row)"
          >删除</el-button>
          <el-button type="text" size="small" @click="watchCustom(scope.row)">查看客户</el-button>
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
    <el-dialog :title="`${isEdit ? '编辑' : '新增'}销售员`" :visible.sync="dialogVisible" width="800px">
      <div>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="销售员名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="选择门店" prop="shopId">
            <div>{{selectStoreTitle}}</div>
            <select-store v-model="form.shopId" @handle-confirm="handleConfirm"/>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item
            v-if="user.kind !== 4"
            label="是否店长"
            prop="is_shop_mgr"
            :required="user.kind !== 4"
          >
            <el-radio v-model="form.is_shop_mgr" :label="0">否</el-radio>
            <el-radio v-model="form.is_shop_mgr" :label="1">是</el-radio>
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
import selectStore from "@/components/selectStore";
import { status } from "@/utils/status";
export default {
  components: {
    buttonOption,
    selectStore
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
      form: {
        is_shop_mgr: 0
      },
      isShopMgr: 0,
      selectStoreTitle: "",
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
          { required: true, message: "请输入销售员名称" },
          { min: 2, max: 25, message: "长度在 2 到 25 个字符" }
        ],
        phone: [
          { required: true, message: "请输入销售员联系方式" },
          { max: 25, message: "长度在25个字符" }
        ],
        shopId: [{ required: true, message: "请选择门店" }],
        is_shop_mgr: [
          { required: true, message: "请选择是否店长" }
        ],
        password: [{ min: 3, max: 40, message: "长度在 3 到 40 个字符" }]
      },
      options: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 0
        }
      ]
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user;
      }
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
      this.form = {
        id: row.user_id,
        name: row.username,
        phone: row.mobile,
        shopId: row.shop_id,
        password: row.password || "",
        status: row.status,
        is_shop_mgr: row.kind === 4 ? 1 : 0
      };
      this.selectStoreTitle = row.shop_name;
      this.dialogVisible = true;
    },
    onAdd() {
      this.isEdit = false;
      this.form = {
        is_shop_mgr: 0
      };
      this.selectStoreTitle = "";
      this.dialogVisible = true;
    },
    watchCustom(row) {
      this.$router.push(`/customer-manage?phone=${row.mobile}`);
    },
    handleConfirm(row) {
      this.selectStoreTitle = row.name;
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
      this.$confirm("确认删除当前销售员？")
        .then(_ => {
          this.deleteApi(row);
        })
        .catch(_ => {});
    },
    deleteApi(row) {
      this.$http({
        url: this.$http.adornUrl("/sys/seller/delete"),
        method: "post",
        data: this.$http.adornData({
          id: row.user_id
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
        url: this.$http.adornUrl("/sys/seller/save"),
        method: "post",
        data: this.$http.adornData(this.form)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          this.form = {is_shop_mgr: 0};
          this.$message({
            message: "添加成功",
            type: "success"
          });
        }
      });
    },
    editSave() {
      this.$http({
        url: this.$http.adornUrl("/sys/seller/update"),
        method: "post",
        data: this.$http.adornData(this.form)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          this.form = {is_shop_mgr: 0};
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

