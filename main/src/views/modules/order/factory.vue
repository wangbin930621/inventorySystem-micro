<template>
  <div class="order-factory">
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入订单号`"
          v-model="params.order_code"
          clearable
        ></el-input>
        <el-button type="default" icon="el-icon-search" :loading="isLoading" @click="search">搜索</el-button>
      </div>
      <div class="_button-right"></div>
    </div>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="order_code" label="订单编号" width="160" align="center"></el-table-column>
      <el-table-column prop="status" label="订单状态" width="160" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="Number(scope.row.send_status) === 1">
            待发货{{ scope.row.modify_info ? '(需要修改)' : '' }}
          </el-tag>
          <el-tag v-else>已发货{{ scope.row.modify_info ? '(修改完成)' : '' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="customer_name" label="客户名称" min-width="120" align="center"></el-table-column>
      <el-table-column label="需求产品" width="180" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.project_info">{{ scope.row.project_info.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="material" label="原材料" width="180" align="center"></el-table-column>
      <el-table-column prop="remark" label="商品描述" min-width="180" align="center"></el-table-column>
      <el-table-column prop="delivery_day" label="预计需求时间" width="160" align="center"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">查看量体</el-button>
          <el-button v-if="scope.row.modify_info" type="text" size="small" @click="lookUpdateInfo(scope.row)">查看修改</el-button>
          <el-button
            v-if="(Number(scope.row.send_status) === 1 || scope.row.modify_info) && isAuth('sys:order:send') && userInfo.userId !== 1"
            type="text"
            size="small"
            @click="deliverGoods(scope.row)"
          >发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 查看量体 -->
    <el-dialog title="量体信息" :visible.sync="bodyVisible" width="850px">
      <el-form
        :model="bodyForm"
        :inline="true"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="胸围：" prop="chestCircle">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.chestCircle"></el-input>
        </el-form-item>
        <el-form-item label="胸高：" prop="chestHeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.chestHeight"></el-input>
        </el-form-item>
        <el-form-item label="胸距：" prop="chestDistance">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.chestDistance"></el-input>
        </el-form-item>
        <el-form-item label="前胸宽：" prop="chestWidth">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.chestWidth"></el-input>
        </el-form-item>
        <el-form-item label="后背宽：" prop="backWidth">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.backWidth"></el-input>
        </el-form-item>
        <el-form-item label="中腰：" prop="midWaist">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.midWaist"></el-input>
        </el-form-item>
        <el-form-item label="裤腰：" prop="pantsWaist">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.pantsWaist"></el-input>
        </el-form-item>
        <el-form-item label="前、后腰长：" prop="frontBackWaist">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.frontBackWaist"></el-input>
        </el-form-item>
        <el-form-item label="臀围：" prop="hipCircle">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.hipCircle"></el-input>
        </el-form-item>
        <el-form-item label="臀高：" prop="hipHeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.hipHeight"></el-input>
        </el-form-item>
        <el-form-item label="肚围：" prop="bellyCircle">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.bellyCircle"></el-input>
        </el-form-item>
        <el-form-item label="肚高：" prop="bellyHeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.bellyHeight"></el-input>
        </el-form-item>
        <el-form-item label="肩宽：" prop="shoulderWidth">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.shoulderWidth"></el-input>
        </el-form-item>
        <el-form-item label="横开领：" prop="horOpenNeck">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.horOpenNeck"></el-input>
        </el-form-item>
        <el-form-item label="前后直开领：" prop="frontBackStraightOpenNeck">
          <el-input
            class="input-width-small"
            readonly
            v-model="bodyForm.figure.frontBackStraightOpenNeck"
          ></el-input>
        </el-form-item>
        <el-form-item label="领围：" prop="neckCircle">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.neckCircle"></el-input>
        </el-form-item>
        <el-form-item label="领高：" prop="neckHeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.neckHeight"></el-input>
        </el-form-item>
        <el-form-item label="衣长：" prop="clothLength">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.clothLength"></el-input>
        </el-form-item>
        <el-form-item label="裙长：" prop="dressLength">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.dressLength"></el-input>
        </el-form-item>
        <el-form-item label="裤长：" prop="pantsLength">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.pantsLength"></el-input>
        </el-form-item>
        <el-form-item label="内增长：" prop="inAddLength">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.inAddLength"></el-input>
        </el-form-item>
        <el-form-item label="袖长：" prop="sleeveLength">
          <el-input class="input-width" v-model="bodyForm.figure.sleeveLength"></el-input>
        </el-form-item>
        <el-form-item label="外袖长：" prop="outerSleeveLength">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.outerSleeveLength"></el-input>
        </el-form-item>
        <el-form-item label="袖笼围：" prop="sleeveCageCircle">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.sleeveCageCircle"></el-input>
        </el-form-item>
        <el-form-item label="袖肥：" prop="sleeveWidth">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.sleeveWidth"></el-input>
        </el-form-item>
        <el-form-item label="袖口：" prop="sleeveCuff">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.sleeveCuff"></el-input>
        </el-form-item>
        <el-form-item label="袖档：" prop="sleeveCrotch">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.sleeveCrotch"></el-input>
        </el-form-item>
        <el-form-item label="直档：" prop="straightCrotch">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.straightCrotch"></el-input>
        </el-form-item>
        <el-form-item label="脚口：" prop="footMouth">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.footMouth"></el-input>
        </el-form-item>
        <el-form-item label="大脚围：" prop="footCircle">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.footCircle"></el-input>
        </el-form-item>
        <el-form-item label="叉高：" prop="ventHeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.ventHeight"></el-input>
        </el-form-item>
        <el-form-item label="身高：" prop="bodyHeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.bodyHeight"></el-input>
        </el-form-item>
        <el-form-item label="体重：" prop="bodyWeight">
          <el-input class="input-width-small" readonly v-model="bodyForm.figure.bodyWeight"></el-input>
        </el-form-item>
        <el-form-item label="体型：" prop="figure">
          <el-select
            v-model="bodyForm.figure.figure"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择体型数据"
            style="width: 420px;"
            disabled
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="量体照片：" prop="images">
          <upload-file v-model="bodyForm.images" readonly style="width: 600px;"/>
        </el-form-item>
        <el-form-item label="量体备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
            readonly
            v-model="bodyForm.figure.remark"
            style="width: 600px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="原材料：" prop="material">
          <el-input readonly v-model="currentRow.material" style="width: 420px;"></el-input>
        </el-form-item>
        <el-form-item label="制作要求：" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
            readonly
            v-model="currentRow.remark"
            style="width: 600px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bodyVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改记录 -->
    <el-dialog title="修改记录" :visible.sync="updateInfoVisible" width="800px">
      <div>
        <el-card v-for="(item, index) in updateInfo" :key="index" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.name }}</span>
          </div>
          <div>
            <el-form label-width="100px">
              <el-form-item label="修改备注：">
                {{ item.modifyInfo.remark }}
              </el-form-item>
              <el-form-item label="修改图片：">
                <upload-file v-model="item.modifyInfo.images" readonly/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateInfoVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 发货 -->
    <el-dialog
      title="发货信息确认"
      :visible.sync="sendOrderVisible"
      @closed="sendOrderClosed"
      width="800px"
    >
      <el-form
        :model="sendOrderForm"
        :rules="sendOrderRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="产品描述" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="sendOrderForm.remark"
            placeholder="请完善发货产品描述，例如胚衣，半成品，成品"
            style="width: 400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品照片" prop="image">
          <upload-file v-model="sendOrderForm.image"/>
        </el-form-item>
        <el-form-item label="完工日期" prop="finish_day">
          <el-date-picker
            v-model="sendOrderForm.finish_day"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="快递运单号" prop="logistics_code">
          <el-input v-model="currentRow.logistics_code" style="width: 400px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendOrderConfirm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
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
      tableData: [],
      isLoading: false,
      total: 0,
      params: {
        currentPage: 1,
        pageSize: 10
      },
      currentRow: {},
      bodyVisible: false,
      bodyForm: {
        figure: {},
        images: []
      },
      updateInfoVisible: false,
      updateInfo: [],
      sendOrderForm: {},
      sendOrderVisible: false,
      sendOrderRules: {
        remark: [
          {
            required: true,
            message: "请完善发货产品描述，例如胚衣，半成品，成品",
            trigger: "blur"
          }
        ],
        image: [{ required: true, message: "请上传发货产品图片" }]
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
    userInfo: {
      get() {
        return this.$store.state.user.info;
      }
    }
  },
  mounted() {
    console.log("userInfo: ", this.userInfo);
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/order/factoryOrderList"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.data instanceof Array &&
            data.data.data.forEach(item => (item.show = false));
          this.tableData = data.data.data;
          this.total = data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    search() {
      this.params.currentPage = 1;
      this.getDataList();
    },
    sendOrderClosed() {
      this.sendOrderForm = {};
    },
    sendOrderConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/order/send"),
            method: "post",
            data: this.$http.adornData({
              order_id: this.currentRow.order_id,
              factory_order_id: this.currentRow.id,
              ...this.sendOrderForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "发货成功！",
                type: "success"
              });
              this.getDataList();
              this.sendOrderVisible = false;
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
    deliverGoods(row) {
      this.sendOrderVisible = true;
      this.currentRow = row;
    },
    goDetail(row) {
      this.bodyVisible = true;
      this.currentRow = row;
      this.bodyForm = row.figure_info || {};
    },
    lookUpdateInfo(row) {
      this.updateInfoVisible = true
      this.updateInfo = this.filterUpdateInfo(row)
    },
    filterUpdateInfo(row) {
      console.log(row)
      const projectInfo = row.project_info
      const modifyInfo = row.modify_info
      const filterData = []
      filterData.push({
        ...{modifyInfo: modifyInfo || {}},
        ...projectInfo
      })
      console.log('filterData: ', filterData)
      return filterData
    },
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getDataList();
    },
    handleCurrentChange(page) {
      this.params.currentPage = page;
      this.getDataList();
    }
  }
};
</script>
