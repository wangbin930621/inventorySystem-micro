<template>
  <div class="order-detail">
    <el-alert
      v-if="form.return_status === 0"
      title="成功提示的文案"
      type="success"
      effect="dark"
      :closable="false"
    >
      <div class="header-title" slot="title">
        <span>订单状态：{{ form.status | getOrderStatus }}</span>
        <span>订单待支付金额：{{ remainMoney }}</span>
      </div>
    </el-alert>
    <el-alert v-else title="成功提示的文案" type="error" effect="dark" :closable="false">
      <div class="header-title" slot="title">
        <span>订单状态：{{ form.return_status | getReturnStatus }}</span>
      </div>
    </el-alert>
    <br>
    <el-form :inline="true" :model="form" label-width="120px" class="demo-form-inline">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>预约信息</span>
        </div>
        <div>
          <el-form-item label="客户名称：">
            <span class="value-width">{{ form.appointment.name || '/' }}</span>
          </el-form-item>
          <el-form-item label="手机号：">
            <span class="value-width">{{ form.appointment.phone || '/' }}</span>
          </el-form-item>
          <el-form-item label="产品信息：">
            <span class="value-width">/</span>
          </el-form-item>
          <el-form-item label="所属门店：">
            <span class="value-width">{{ form.appointment.shop_name || '/' }}</span>
          </el-form-item>
          <el-form-item label="所属销售：">
            <span class="value-width">{{ form.appointment.seller_name || '/' }}</span>
          </el-form-item>
          <el-form-item label="客户来源：">
            <span class="value-width">{{ form.appointment.source || '/' }}</span>
          </el-form-item>
          <el-form-item label="需求日期：">
            <span class="value-width">{{ form.appointment.wedding_day || '/' }}</span>
          </el-form-item>
          <el-form-item label="礼服师傅：">
            <span class="value-width">{{ form.appointment.dresser || '/' }}</span>
          </el-form-item>
          <el-form-item label="预算：">
            <span class="value-width">{{ form.appointment.budget || '/' }}</span>
          </el-form-item>
          <el-form-item label="西服推荐：">
            <span class="value-width">{{ form.appointment.suit || '/' }}</span>
          </el-form-item>
          <el-form-item label="婚纱推荐：">
            <span class="value-width">{{ form.appointment.dress || '/' }}</span>
          </el-form-item>
          <el-form-item label="珠宝推荐：">
            <span class="value-width">{{ form.appointment.jewel || '/' }}</span>
          </el-form-item>
          <el-form-item label="四大：">
            <span class="value-width">{{ form.appointment.sida || '/' }}</span>
          </el-form-item>
          <el-form-item label="备注：">
            <span class="value-width">{{ form.appointment.remark || '/' }}</span>
          </el-form-item>
        </div>
      </el-card>
      <br>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>商品信息</span>
        </div>
        <div>
          <el-card
            class="product-card"
            v-for="(item, index) in form.appointment.project_info"
            :key="index"
            :body-style="{ padding: '0px' }"
          >
            <el-image
              style="width: 100%; height: 120px"
              :src="item.image[0]"
              :preview-src-list="item.image"
            ></el-image>
            <div style="padding: 14px;">
              <span class="image-span">{{ item.name }}</span>
              <div class="bottom">
                <span>数量：{{ item.count }}</span>
                <template>
                  <el-button
                    v-if="form.send_info && form.send_info[item.id]"
                    type="text"
                    @click="getGood(form.send_info[item.id])"
                  >已发货</el-button>
                  <el-button v-else type="text">未发货</el-button>
                </template>
              </div>
            </div>
          </el-card>
        </div>
      </el-card>
      <br>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>订单信息</span>
        </div>
        <div>
          <el-form-item label="交货日期：" prop="delivery_day">
            <el-date-picker
              class="input-width-middle"
              v-model="form.delivery_day"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              readonly
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="子女联系方式：" prop="children">
            <el-input class="value-width" v-model="form.children" readonly></el-input>
          </el-form-item>
          <el-form-item label="面料：" prop="material">
            <el-input class="value-width" v-model="form.material" readonly></el-input>
          </el-form-item>
          <el-form-item label="款式编号：" prop="style_code">
            <el-input class="value-width" v-model="form.style_code" readonly></el-input>
          </el-form-item>
          <el-form-item label="制作要求：" prop="remark">
            <el-input
              style="width: 500px;"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.remark"
              readonly
            ></el-input>
          </el-form-item>
        </div>
      </el-card>
      <br>
      <el-card v-if="form.figure" shadow="never">
        <div slot="header" class="clearfix">
          <span>量体信息</span>
        </div>
        <div>
          <el-form-item label="胸围：" prop="chestCircle">
            <el-input class="input-width-small" v-model="form.figure.chestCircle"></el-input>
          </el-form-item>
          <el-form-item label="胸高：" prop="chestHeight">
            <el-input class="input-width-small" v-model="form.figure.chestHeight"></el-input>
          </el-form-item>
          <el-form-item label="胸距：" prop="chestDistance">
            <el-input class="input-width-small" v-model="form.figure.chestDistance"></el-input>
          </el-form-item>
          <el-form-item label="前胸宽：" prop="chestWidth">
            <el-input class="input-width-small" v-model="form.figure.chestWidth"></el-input>
          </el-form-item>
          <el-form-item label="后背宽：" prop="backWidth">
            <el-input class="input-width-small" v-model="form.figure.backWidth"></el-input>
          </el-form-item>
          <el-form-item label="中腰：" prop="midWaist">
            <el-input class="input-width-small" v-model="form.figure.midWaist"></el-input>
          </el-form-item>
          <el-form-item label="裤腰：" prop="pantsWaist">
            <el-input class="input-width-small" v-model="form.figure.pantsWaist"></el-input>
          </el-form-item>
          <el-form-item label="前、后腰长：" prop="frontBackWaist">
            <el-input class="input-width-small" v-model="form.figure.frontBackWaist"></el-input>
          </el-form-item>
          <el-form-item label="臀围：" prop="hipCircle">
            <el-input class="input-width-small" v-model="form.figure.hipCircle"></el-input>
          </el-form-item>
          <el-form-item label="臀高：" prop="hipHeight">
            <el-input class="input-width-small" v-model="form.figure.hipHeight"></el-input>
          </el-form-item>
          <el-form-item label="肚围：" prop="bellyCircle">
            <el-input class="input-width-small" v-model="form.figure.bellyCircle"></el-input>
          </el-form-item>
          <el-form-item label="肚高：" prop="bellyHeight">
            <el-input class="input-width-small" v-model="form.figure.bellyHeight"></el-input>
          </el-form-item>
          <el-form-item label="肩宽：" prop="shoulderWidth">
            <el-input class="input-width-small" v-model="form.figure.shoulderWidth"></el-input>
          </el-form-item>
          <el-form-item label="横开领：" prop="horOpenNeck">
            <el-input class="input-width-small" v-model="form.figure.horOpenNeck"></el-input>
          </el-form-item>
          <el-form-item label="前后直开领：" prop="frontBackStraightOpenNeck">
            <el-input class="input-width-small" v-model="form.figure.frontBackStraightOpenNeck"></el-input>
          </el-form-item>
          <el-form-item label="领围：" prop="neckCircle">
            <el-input class="input-width-small" v-model="form.figure.neckCircle"></el-input>
          </el-form-item>
          <el-form-item label="领高：" prop="neckHeight">
            <el-input class="input-width-small" v-model="form.figure.neckHeight"></el-input>
          </el-form-item>
          <el-form-item label="衣长：" prop="clothLength">
            <el-input class="input-width-small" v-model="form.figure.clothLength"></el-input>
          </el-form-item>
          <el-form-item label="裙长：" prop="dressLength">
            <el-input class="input-width-small" v-model="form.figure.dressLength"></el-input>
          </el-form-item>
          <el-form-item label="裤长：" prop="pantsLength">
            <el-input class="input-width-small" v-model="form.figure.pantsLength"></el-input>
          </el-form-item>
          <el-form-item label="内增长：" prop="inAddLength">
            <el-input class="input-width-small" v-model="form.figure.inAddLength"></el-input>
          </el-form-item>
          <el-form-item label="袖长：" prop="sleeveLength">
            <el-input class="input-width-small" v-model="form.figure.sleeveLength"></el-input>
          </el-form-item>
          <el-form-item label="外袖长：" prop="outerSleeveLength">
            <el-input class="input-width-small" v-model="form.figure.outerSleeveLength"></el-input>
          </el-form-item>
          <el-form-item label="袖笼围：" prop="sleeveCageCircle">
            <el-input class="input-width-small" v-model="form.figure.sleeveCageCircle"></el-input>
          </el-form-item>
          <el-form-item label="袖肥：" prop="sleeveWidth">
            <el-input class="input-width-small" v-model="form.figure.sleeveWidth"></el-input>
          </el-form-item>
          <el-form-item label="袖口：" prop="sleeveCuff">
            <el-input class="input-width-small" v-model="form.figure.sleeveCuff"></el-input>
          </el-form-item>
          <el-form-item label="袖档：" prop="sleeveCrotch">
            <el-input class="input-width-small" v-model="form.figure.sleeveCrotch"></el-input>
          </el-form-item>
          <el-form-item label="直档：" prop="straightCrotch">
            <el-input class="input-width-small" v-model="form.figure.straightCrotch"></el-input>
          </el-form-item>
          <el-form-item label="脚口：" prop="footMouth">
            <el-input class="input-width-small" v-model="form.figure.footMouth"></el-input>
          </el-form-item>
          <el-form-item label="大脚围：" prop="footCircle">
            <el-input class="input-width-small" v-model="form.figure.footCircle"></el-input>
          </el-form-item>
          <el-form-item label="叉高：" prop="ventHeight">
            <el-input class="input-width-small" v-model="form.figure.ventHeight"></el-input>
          </el-form-item>
          <el-form-item label="身高：" prop="bodyHeight">
            <el-input class="input-width-small" v-model="form.figure.bodyHeight"></el-input>
          </el-form-item>
          <el-form-item label="体重：" prop="bodyWeight">
            <el-input class="input-width-small" v-model="form.figure.bodyWeight"></el-input>
          </el-form-item>
          <el-form-item label="体型：" prop="figure">
            <el-select
              v-model="form.figure.figure"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择体型数据"
              style="width: 420px;"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="量体照片：" prop="images" style="display: block;">
            <upload-file v-model="form.images" style="width: 500px;"/>
          </el-form-item>
          <el-form-item label="量体备注：" prop="remark" style="display: block;">
            <el-input type="textarea" :rows="5" v-model="form.figure.remark" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="面料：" prop="material" style="display: block;">
            <el-input v-model="form.material" style="width: 420px;"></el-input>
          </el-form-item>
          <el-form-item label="制作要求：" prop="remark" style="display: block;">
            <el-input type="textarea" :rows="5" v-model="form.remark" style="width: 500px;"></el-input>
          </el-form-item>
        </div>
      </el-card>
      <br>
      <el-card v-if="form.sanjian" shadow="never">
        <div slot="header" class="clearfix">
          <span>三检信息</span>
        </div>
        <div>
          <el-form-item label="三检日期：" prop="date">
            <el-date-picker
              v-model="form.sanjian.date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              readonly
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="三检人员：" prop="name">
            <el-input class="value-width" v-model="form.sanjian.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="三检编号：" prop="code">
            <el-input class="value-width" v-model="form.sanjian.code" readonly></el-input>
          </el-form-item>
          <el-form-item label="三检备注：" prop="remark">
            <el-input
              style="width: 500px;"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.sanjian.remark"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="三检图片：" prop="images">
            <upload-file v-model="form.sanjian.images" readonly/>
          </el-form-item>
        </div>
      </el-card>
      <br>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>付款信息</span>
        </div>
        <div>
          <el-form-item label="总价：" prop="total">
            ￥
            <el-input class="value-width" v-model="form.total" readonly></el-input>
          </el-form-item>
          <el-form-item label="定金：" prop="deposit">
            ￥
            <el-input class="value-width" v-model="form.deposit" readonly></el-input>
          </el-form-item>
          <el-form-item label="预支付日期：" prop="arrears_day">
            <el-date-picker
              class="value-width"
              v-model="form.arrears_day"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="form.remain_pay_date" label="尾款支付日期：" prop="remain_pay_date">
            <el-date-picker
              class="value-width"
              v-model="form.remain_pay_date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="暂未录入"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="form.invoice_images" label="发票信息" style="display: block;">
            <upload-file v-model="form.invoice_images" readonly/>
          </el-form-item>
        </div>
      </el-card>
      <div class="static-bottom">
        <el-button v-if="isAuth('sys:order:update')" style="float: right" type="primary" :loading="isLoading" @click="toUpdate">提交修改</el-button>
        <el-button style="float: right;margin-right: 10px;" @click="goBack">返回</el-button>
      </div>
    </el-form>
    <el-dialog title="发货详情" :visible.sync="sendGoodVisible" width="800px">
      <el-form ref="form" label-width="120px">
        <el-form-item label="发货商品描述">{{ currentGood.remark }}</el-form-item>
        <el-form-item label="发货图片">
          <upload-file v-model="currentGood.image" readonly/>
        </el-form-item>
        <el-form-item label="完工日期">{{ currentGood.finish_day || '/' }}</el-form-item>
        <el-form-item label="快递订单号">{{ currentGood.logistics_code || '/' }}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendGoodVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { orderStatus, returnStatus } from "@/utils/status";
import uploadFile from "@/components/uploadFile";
export default {
  components: {
    uploadFile
  },
  filters: {
    getOrderStatus(t) {
      return orderStatus(t);
    },
    getReturnStatus(t) {
      return returnStatus(t);
    }
  },
  data() {
    return {
      form: {
        appointment: {}
      },
      currentGood: {},
      isLoading: false,
      sendGoodVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      options: [
        {
          label: "含胸",
          value: 1
        },
        {
          label: "挺胸",
          value: 2
        },
        {
          label: "耸肩",
          value: 3
        },
        {
          label: "平肩",
          value: 4
        },
        {
          label: "驼背",
          value: 5
        },
        {
          label: "翘臀",
          value: 6
        },
        {
          label: "扁臀",
          value: 7
        },
        {
          label: "胸平",
          value: 8
        },
        {
          label: "胸大",
          value: 9
        },
        {
          label: "凸肚",
          value: 10
        },
        {
          label: "胃包大",
          value: 11
        }
      ]
    };
  },
  computed: {
    remainMoney() {
      const { total = 0, deposit = 0, remain_money = 0, status } = this.form
      let price = total - deposit - remain_money
      if (status === 9 || status === 10 || status === 11) {
        price = (0).toFixed(2);
      }
      return price;
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/sys/order/info/${this.id}`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.form = data.data;
        } else {
          this.form = {};
        }
        this.isLoading = false;
      });
    },
    toUpdate() {
      const { figure, remain_pay_date, images, sanjian, arrears_day } = this.form
      const params = {
        id: this.id,
        ...figure ? { figure } : {},
        ...remain_pay_date ? { remain_pay_date } : {},
        ...images ? { images } : {},
        ...sanjian ? { sanjian } : {},
        ...arrears_day ? { arrears_day } : {},
      };
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/sys/order/update`),
        method: "post",
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
        }
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      });
    },
    getGood(row) {
      console.log(row);
      this.sendGoodVisible = true;
      this.currentGood = row;
    },
    goBack() {
      this.$router.push("/order-manage");
    }
  }
};
</script>
<style lang="scss">
.order-detail {
  padding-bottom: 100px;
  .el-alert__content {
    width: 100%;
  }
  .header-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .value-width {
    width: 200px;
    display: inline-block;
  }
  .arrears-font {
    font-size: 18px;
    color: red;
  }
  .static-bottom {
    margin-top: 10px;
    height: 50px;
    padding: 0 22px;
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
    display: block;
    white-space: nowrap;
  }
  input[readonly] {
    border: 0;
  }
  textarea[readonly] {
    border: 0;
  }
  .el-select{
    input[readonly] {
      border: 1px solid #dcdfe6!important;
    }
  }
}
</style>
