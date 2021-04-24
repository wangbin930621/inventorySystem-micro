<template>
  <div class="stock-add">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input class="input-width-large" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="定制价" prop="price">
        <el-input class="input-width-large" type="number" v-model="ruleForm.price"></el-input>
      </el-form-item>
      <!-- <el-form-item label="进货价" prop="purchase_price" required>
        <el-input class="input-width-large" type="number" v-model="ruleForm.purchase_price"></el-input>
      </el-form-item> -->
      <el-form-item label="库存" prop="stock">
        <el-input class="input-width-large" type="number" v-model="ruleForm.stock"></el-input>
      </el-form-item>
      <el-form-item label="产品照片" prop="image">
        <upload-file v-model="ruleForm.image"/>
      </el-form-item>
      <el-form-item label="所属厂商" prop="factory_id">
        <el-input class="input-width-large" placeholder="请选择厂商" v-model="selectStoreTitle" readonly></el-input>
        <select-factory
          style="margin-top: 10px;"
          v-model="ruleForm.factory_id"
          @handle-confirm="handleConfirm"
        />
      </el-form-item>
      <el-form-item label="产品描述" prop="remark">
        <el-input type="textarea" :rows="4" placeholder="请输入颜色、尺寸等" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="库存状态" prop="status">
        <el-radio v-model="ruleForm.status" :label="1">开启</el-radio>
        <el-radio v-model="ruleForm.status" :label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{ this.isEdit ? '修改' : '添加' }}</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadFile from "@/components/uploadFile";
import selectFactory from "@/components/selectFactory";

export default {
  components: {
    uploadFile,
    selectFactory
  },
  data() {
    return {
      id: "",
      isEdit: false,
      ruleForm: {
        status: 1,
        image: []
      },
      selectStoreTitle: "",
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 1, max: 25, message: "长度在 1 到 25 个字符", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入定制价", trigger: "blur" }],
        factory_id: [{ required: true, message: "请选择所属生产", trigger: "change" }],
        purchase_price: [
          { required: true, message: "请输入进货价", trigger: "blur" }
        ],
        stock: [{ required: true, message: "请输入库存数量", trigger: "blur" }],
        image: [{ type: 'array', required: true, message: "请上传商品图片" }]
      }
    };
  },
  mounted() {
    const { id } = this.$route.query;
    if (id) {
      this.id = id;
      this.isEdit = true;
      this.getDetail();
    } else {
      this.ruleForm = {
        status: 1,
        image: []
      }
    }
  },
  methods: {
    getDetail() {
      this.$http({
        url: this.$http.adornUrl(`/sys/dressProject/info/${this.id}`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.ruleForm = data.data;
          this.selectStoreTitle = data.data.factory_name || '';
          if (!data.data.image) {
            data.data.image = [];
          }
        }
        this.isLoading = false;
      });
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          const {
            name,
            image,
            price,
            stock,
            status,
            remark,
            factory_id
          } = this.ruleForm;
          const params = {
            name,
            image,
            price: Number(price),
            stock: Number(stock),
            purchase_price: 0,
            status,
            remark,
            factory_id
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
        url: this.$http.adornUrl("/sys/dressProject/update"),
        method: "post",
        data: this.$http.adornData({
          id: parseInt(this.id),
          ...params
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改商品成功!",
            type: "success"
          });
          this.$router.push("/stock-manage");
        }
      });
    },
    addSave(params) {
      this.$http({
        url: this.$http.adornUrl("/sys/dressProject/save"),
        method: "post",
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加商品成功!",
            type: "success"
          });
          this.$router.push("/stock-manage");
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    handleConfirm(row) {
      this.selectStoreTitle = row.name;
    }
    // handleUploadSuccess(URL) {
    //   this.ruleForm.image.push(URL);
    // }
  }
};
</script>