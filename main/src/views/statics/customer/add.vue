<template>
  <div class="customer-add">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="客户名称：" prop="name">
        <el-input class="input-width-large" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" prop="phone">
        <el-input class="input-width-large" v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="入店时间：" prop="inShop_time">
        <el-date-picker
          v-model="ruleForm.inShop_time"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预约状态：" prop="book_status">
        <el-radio-group v-model="ruleForm.book_status">
          <el-radio :label="1">已入店</el-radio>
          <el-radio :label="2">未预约</el-radio>
          <el-radio :label="3">已预约</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="库存产品：" prop="project_id">
        <el-button
          type="primary"
          size="mini"
          @click="selectProduct"
        >{{`${productInfo.length > 0 ? '修改' : '选择'}`}}产品</el-button>&nbsp;
        <div>
          <el-card
            class="product-card"
            v-for="(item, index) in productInfo"
            :key="index"
            :body-style="{ padding: '0px' }"
          >
            <el-image
              style="width: 100%; height: 120px"
              :src="item.image[0]"
              :preview-src-list="item.image"
            ></el-image>
            <div style="padding: 8px;">
              <p class="image-span">{{ item.name }}</p>
              <p class="image-span">库存：{{ item.stock }}</p>
              <div class="bottom">
                <el-input-number
                  v-model="item.count"
                  controls-position="right"
                  size="mini"
                  :min="1"
                  :max="item.stock || 0"
                  style="width: 90px;"
                ></el-input-number>
                <!-- <el-input v-model="item.count" size="mini" maxlength="4" placeholder="数量" style="width: 60px;"></el-input> -->
                <el-button type="text" class="button" size="mini" @click="deleteProcut(index)">删除</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <!-- <span>{{productInfo}}</span> -->
      </el-form-item>
      <el-form-item label="所属销售：" prop="seller_id">
        <el-button
          v-if="user.kind === 1 || user.kind === 4"
          type="primary"
          size="mini"
          @click="selectSaler"
        >{{`${salerInfo.user_id ? '修改' : '选择'}`}}销售</el-button>&nbsp;
        <span>{{salerInfo.username}}</span>
      </el-form-item>
      <el-form-item label="客户来源：" prop="source">
        <el-select v-model="ruleForm.source" placeholder="请选择">
          <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="需求日期：" prop="wedding_day">
        <el-date-picker
          v-model="ruleForm.wedding_day"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="礼服师傅：" prop="dresser">
        <el-input class="input-width-large" v-model="ruleForm.dresser"></el-input>
      </el-form-item>
      <el-form-item label="预算：" prop="budget">
        <el-input-number class="input-width-large" v-model="ruleForm.budget" :controls="false"></el-input-number>元
      </el-form-item>
      <el-form-item label="西服推荐：" prop="suit">
        <el-input class="input-width-large" v-model="ruleForm.suit"></el-input>
      </el-form-item>
      <el-form-item label="婚纱推荐：" prop="dress">
        <el-input class="input-width-large" v-model="ruleForm.dress"></el-input>
      </el-form-item>
      <el-form-item label="珠宝推荐：" prop="jewel">
        <el-input class="input-width-large" v-model="ruleForm.jewel"></el-input>
      </el-form-item>
      <el-form-item label="四大：" prop="sida">
        <el-input type="textarea" maxlength="250" :rows="2" v-model="ruleForm.sida"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" maxlength="250" :rows="2" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="submitForm('ruleForm')"
        >{{ this.isEdit ? '修改' : '添加' }}</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择销售" :visible.sync="salerVisible" width="80%">
      <select-saler v-model="ruleForm.seller_id" @handle-confirm="handleSalerConfirm"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="salerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择商品" :visible.sync="productVisible" width="80%">
      <select-product v-model="project_id" @handle-confirm="handleProductConfirm"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="productVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import selectSaler from "@/components/selectSaler";
import selectProduct from "@/components/selectProduct";
export default {
  components: {
    selectSaler,
    selectProduct
  },
  data() {
    return {
      isEdit: false,
      storeVisible: false,
      salerVisible: false,
      productVisible: false,
      ruleForm: {
        book_status: 1,
      },
      salerInfo: {},
      productInfo: [],
      project_id: [],
      sourceOptions: [],
      isLoading: false,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入客户联系方式" }],
        source: [{ required: true, message: "请选择客户来源" }],
        book_status: [{ required: true, message: "请选择预约状态" }]
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
      this.productInfo = [];
    }
    this.getSourseList();
    const { kind, id, name } = this.user;
    if (Number(kind) === 3) {
      // 销售默认设置
      this.ruleForm.seller_id = id;
      this.salerInfo.username = name;
    }
  },
  methods: {
    getDetail() {
      this.$http({
        url: this.$http.adornUrl(`/sys/customer/info/${this.id}`),
        method: "get",
        params: this.$http.adornParams({})
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.ruleForm = data.data;
            this.salerInfo = {
              username: data.data.seller_name,
              user_id: data.data.seller_id
            };
            this.project_id = Object.keys(this.ruleForm.project_ids).map(id => Number(id))
            this.productInfo = this.formateProduct(data.data.project_info);
          } else {
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    deleteProcut(index) {
      this.productInfo.splice(index, 1)
    },
    submitForm(formName) {
      const pIds = {};
      this.productInfo.forEach(item => {
        pIds[item.id] = Number(item.count);
      });
      this.ruleForm.project_ids = pIds;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoading = true;
          this.isEdit ? this.editSave() : this.addSave();
        } else {
          return false;
        }
      });
    },
    handleSalerConfirm(row) {
      this.salerInfo = row;
      this.ruleForm.shop_id = row.shop_id;
    },
    handleProductConfirm(row) {
      this.productInfo = this.formateProduct(row);
    },
    formateProduct(row) {
      const rowFilter = [];
      row.forEach(item => {
        const { id, name, image, stock, count = 1 } = item;
        rowFilter.push({
          id,
          name,
          image,
          count,
          stock
        });
      });
      return rowFilter;
    },
    selectStore() {
      this.storeVisible = true;
    },
    selectSaler() {
      this.salerVisible = true;
    },
    selectProduct() {
      this.productVisible = true;
    },
    addSave() {
      return new Promise((resolve, rejects) => {
        this.$http({
          url: this.$http.adornUrl("/sys/customer/save"),
          method: "post",
          data: this.$http.adornData(this.ruleForm)
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "添加客户成功!",
                type: "success"
              });
              this.$router.push("/customer-manage");
            }
            this.isLoading = false;
          })
          .catch(err => {
            this.isLoading = false;
          });
      });
    },
    editSave() {
      delete this.ruleForm["create_user_id"];
      delete this.ruleForm["created_at"];
      delete this.ruleForm["updated_at"];
      delete this.ruleForm["deleted_at"];
      this.$http({
        url: this.$http.adornUrl("/sys/customer/update"),
        method: "post",
        data: this.$http.adornData({
          id: this.id,
          ...this.ruleForm
        })
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "编辑客户成功!",
              type: "success"
            });
            this.$router.push("/customer-manage");
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    getSourseList() {
      this.$http({
        url: this.$http.adornUrl("/sys/customer/source"),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.sourceOptions = data.data;
          // this.totalPage = data.page.totalCount;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss">
.customer-add {
  .product-card {
    .el-card__body {
      padding: 0px;
      display: flex;
      flex-direction: column;
      .el-input-number.is-controls-right .el-input__inner {
        padding-left: 0px;
        padding-right: 28px;
      }
    }
  }
  .product-card {
    width: 150px;
    font-size: 12px;
    display: inline-block;
    margin-right: 5px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 120px;
    object-fit: cover;
  }

  .image-span {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
    margin: 0;
  }
}
</style>