<template>
  <div class="order-review">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="总览月份：" prop="overview_month" required>
        <el-date-picker
          v-model="ruleForm.overview_month"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="总负责人：" prop="director" required>
        <el-input class="input-width" v-model="ruleForm.director"></el-input>
      </el-form-item>
      <el-form-item label="督察人：" prop="checker" required>
        <el-input class="input-width" v-model="ruleForm.checker"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input class="input-width" v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="微信：" prop="wechat">
        <el-input class="input-width" v-model="ruleForm.wechat"></el-input>
      </el-form-item>
      <el-form-item label="子女信息：" prop="children">
        <el-input class="input-width" v-model="ruleForm.children"></el-input>
      </el-form-item>
      <el-form-item label="婆婆妈妈信息：" prop="mother">
        <el-input class="input-width" v-model="ruleForm.mother"></el-input>
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input class="input-width" v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="满意度：" prop="satisfaction">
        <upload-file v-model="satisfaction"/>
      </el-form-item>
      <el-form-item label="礼服师：" prop="dresser">
        <el-input class="input-width" v-model="ruleForm.dresser"></el-input>
      </el-form-item>
      <el-form-item label="回访门店：" prop="revisit_shop" required>
        <el-input class="input-width" v-model="ruleForm.revisit_shop"></el-input>
      </el-form-item>
      <el-form-item label="回访日期：" required>
        <el-date-picker
          v-model="ruleForm.revisit_date"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注：" prop="desc">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">录入回访</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import uploadFile from "@/components/uploadFile";
export default {
  components: {
    uploadFile
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
      id: "",
      review_id: "",
      satisfaction: []
    };
  },
  watch: {
    satisfaction(arr) {
      this.ruleForm.satisfaction = arr.join(',')
    }
  },
  mounted() {
    const { review_id, id } = this.$route.query;
    if (id) {
      this.id = id;
    }
    if (review_id) {
      this.review_id = review_id;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/order/feedback"),
            method: "post",
            data: this.$http.adornData({
              id: this.id,
              ...this.ruleForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "回访完成",
                type: "success"
              });
              this.$router.push("/order-manage");
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goBack() {
      this.$router.push("/order-manage");
    }
  }
};
</script>
<style lang="scss">
.order-review {
  .input-width {
    width: 300px;
  }
}
</style>
