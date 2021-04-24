<template>
  <div class="customer-follow-add">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="所属销售：" prop="seller_id">
        <el-button
          v-if="user.kind === 1"
          type="primary"
          size="mini"
          @click="selectSaler"
        >{{`${ruleForm.seller_id ? '修改' : '选择'}`}}销售</el-button>&nbsp;
        <span>{{ruleForm.seller_name}}</span>
      </el-form-item>
      <el-form-item label="跟进小记" prop="remark" required>
        <el-input
          type="textarea"
          :rows="6"
          maxlength="250"
          show-word-limit
          v-model="ruleForm.remark"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{ this.isEdit ? '修改' : '添加' }}</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择销售" :visible.sync="salerVisible" width="80%">
      <select-saler v-model="ruleForm.seller_id" @handle-confirm="handleSalerConfirm"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="salerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import selectSaler from "@/components/selectSaler";

export default {
  components: {
    selectSaler
  },
  data() {
    return {
      id: "",
      cId: '',
      isEdit: false,
      ruleForm: {},
      salerVisible: false,
      selectStoreTitle: "",
      rules: {
        seller_id: [
          { required: true, message: "请选择所属销售", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入跟进小计", trigger: "blur" },
          {
            min: 1,
            max: 250,
            message: "长度在 1 到 250 个字符",
            trigger: "blur"
          }
        ],
        purchase_price: [
          { required: true, message: "请输入进货价", trigger: "blur" }
        ],
        stock: [{ required: true, message: "请输入库存数量", trigger: "blur" }],
        image: [{ required: true, message: "请上传商品图片" }]
      }
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
    if (this.$route.query.id) {
      this.isEdit = true;
      this.id = this.$route.query.id;
      this.getDetail();
    } else {
      this.isEdit = false;
      this.ruleForm = {};
    }
    if (this.$route.query.c_id) {
      this.cId = this.$route.query.c_id
    }
    const { kind, id, name } = this.user;
    if (Number(kind) === 3) {
      // 销售默认设置
      this.ruleForm.seller_id = id;
      this.ruleForm.seller_name = name;
    }
  },
  methods: {
    getDetail() {
      this.$http({
        url: this.$http.adornUrl(`/sys/customerFollow/info/${this.id}`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.ruleForm = data.data;
          if (!data.data.image) {
            data.data.image = [];
          }
        }
        this.isLoading = false;
      });
    },
    selectSaler() {
      this.salerVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { seller_id, remark } = this.ruleForm;
          const params = {
            seller_id,
            remark
          };
          this.isEdit ? this.editSave(params) : this.addSave(params);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editSave(params) {
      this.$http({
        url: this.$http.adornUrl("/sys/customerFollow/update"),
        method: "post",
        data: this.$http.adornData({
          id: parseInt(this.id),
          customer_id: this.cId,
          ...params
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功!",
            type: "success"
          });
          this.$router.push(`/follow-list?id=${this.cId}`);
        }
      });
    },
    addSave(params) {
      this.$http({
        url: this.$http.adornUrl("/sys/customerFollow/save"),
        method: "post",
        data: this.$http.adornData({
          customer_id: this.cId,
          ...params
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功!",
            type: "success"
          });
          this.$router.push(`/follow-list?id=${this.cId}`);
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    handleConfirm(row) {
      this.selectStoreTitle = row.name;
    },
    handleSalerConfirm(row) {
      this.ruleForm.seller_name = row.username;
    }
    // handleUploadSuccess(URL) {
    //   this.ruleForm.image.push(URL);
    // }
  }
};
</script>