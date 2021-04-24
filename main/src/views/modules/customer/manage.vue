<template>
  <div class="customer-manage">
    <el-tabs v-model="params.book_status" type="card" @tab-click="onChange">
      <el-tab-pane key="tab_1" :label="`全部客户`" name="0"></el-tab-pane>
      <!-- <el-tab-pane key="tab_2" :label="`未入店`" name="0"></el-tab-pane> -->
      <el-tab-pane key="tab_2" :label="`已入店`" name="1"></el-tab-pane>
      <el-tab-pane key="tab_3" :label="`未预约`" name="2"></el-tab-pane>
      <el-tab-pane key="tab_4" :label="`已预约`" name="3"></el-tab-pane>
    </el-tabs>
    <br>
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-small"
          :placeholder="`订单号`"
          v-model="params.order_code"
          clearable
        ></el-input>
        <el-input
          class="input-width-small"
          :placeholder="`客户手机号`"
          v-model="params.phone"
          clearable
        ></el-input>
        <el-input
          class="input-width-small"
          :placeholder="`客户名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-button type="default" icon="el-icon-search" :loading="isLoading" @click="search">搜索</el-button>
      </div>
      <div class="_button-right">
        <!-- <el-button
          v-if="!$route.query.phone"
          type="primary"
          @click="onBack"
        >返回</el-button> -->
        <el-button
          v-if="isAuth('sys:customer:save')"
          type="primary"
          @click="onAdd"
        >新增</el-button>
        <el-button type="danger"  @click="exportExcel">导出</el-button>
      </div>
    </div>
    <br>
    <el-table :data="tableData" v-loading="isLoading" border style="width: 100%">
      <el-table-column prop="remark" label="备注" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.remark || '/' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="客户名称" width="180" align="center"></el-table-column>
      <el-table-column prop="wedding_day" label="婚期" width="180" align="center"></el-table-column>
      <el-table-column prop="name" label="预约状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.book_status === 1">已入店</el-tag>
          <el-tag v-else-if="scope.row.book_status === 2" type="danger">未预约</el-tag>
          <el-tag v-else-if="scope.row.book_status === 3" type="success">已预约</el-tag>
          <!-- <el-tag v-else type="info">未入店</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="140" align="center"></el-table-column>
      <el-table-column prop="project_name" label="项目" width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.project_info ? scope.row.project_info.map(item => item.name).join('，') : '' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="shop_name" label="所属门店" width="180" align="center"></el-table-column>
      <el-table-column prop="seller_name" label="所属销售" width="200" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.seller_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="客户来源" width="180" align="center"></el-table-column>
      <el-table-column prop="dresser" label="礼服师" width="180" align="center"></el-table-column>
      <el-table-column prop="budget" label="预算(元)" width="180" align="center"></el-table-column>
      <el-table-column prop="dress" label="婚纱推荐" width="180" align="center"></el-table-column>
      <el-table-column prop="suit" label="西装推荐" width="180" align="center"></el-table-column>
      <el-table-column prop="jewel" label="珠宝推荐" width="180" align="center"></el-table-column>
      <el-table-column prop="sida" label="四大" width="180" align="center"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="220" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:order:save')"
            type="text"
            size="small"
            @click="createOrder(scope.row)"
          >生成订单</el-button>
          <el-button
            v-if="isAuth('sys:customerFollow:list')"
            type="text"
            size="small"
            @click="followOrder(scope.row)"
          >跟进小记</el-button>
          <el-button
            v-if="isAuth('sys:customer:update')"
            type="text"
            size="small"
            @click="update(scope.row)"
          >详情</el-button>
          <el-button
            v-if="isAuth('sys:customer:delete')"
            type="text"
            size="small"
            @click="deleteRow(scope.row)"
          >删除</el-button>
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
    <el-dialog
      title="生成订单"
      :visible.sync="createOrderVisible"
      width="80%"
      :before-close="handleOrderClose"
    >
      <div>
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>预约信息</span>
          </div>
          <el-form :inline="true" :model="currentRow" label-width="140px" class="demo-form-inline">
            <el-form-item label="客户名称：">
              <span class="value-width">{{ currentRow.name || '/' }}</span>
            </el-form-item>
            <el-form-item label="手机号：">
              <span class="value-width">{{ currentRow.phone || '/' }}</span>
            </el-form-item>
            <el-form-item label="所属门店：">
              <span class="value-width">{{ currentRow.shop_name || '/' }}</span>
            </el-form-item>
            <el-form-item label="所属销售：">
              <span class="value-width">{{ currentRow.seller_name  || '/' }}&nbsp;&nbsp;{{currentRow.seller_phone}}</span>
            </el-form-item>
            <el-form-item label="客户来源：">
              <span class="value-width">{{ currentRow.source || '/' }}</span>
            </el-form-item>
            <el-form-item label="需求日期：">
              <span class="value-width">{{ currentRow.wedding_day || '/' }}</span>
            </el-form-item>
            <el-form-item label="礼服师傅：">
              <span class="value-width">{{ currentRow.dresser || '/' }}</span>
            </el-form-item>
            <el-form-item label="预算：">
              <span class="value-width">{{ currentRow.budget || '/' }}</span>
            </el-form-item>
            <el-form-item label="西服推荐：">
              <span class="value-width">{{ currentRow.suit || '/' }}</span>
            </el-form-item>
            <el-form-item label="婚纱推荐：">
              <span class="value-width">{{ currentRow.dress || '/' }}</span>
            </el-form-item>
            <el-form-item label="珠宝推荐：">
              <span class="value-width">{{ currentRow.jewel || '/' }}</span>
            </el-form-item>
            <el-form-item label="四大：">
              <span class="value-width">{{ currentRow.sida || '/' }}</span>
            </el-form-item>
            <el-form-item label="备注：">
              <span class="value-width">{{ currentRow.remark || '/' }}</span>
            </el-form-item>
          </el-form>
        </el-card>
        <br>
        <el-card v-if="currentRow.project_info" shadow="never">
          <div slot="header" class="clearfix">
            <span>商品信息</span>
          </div>
          <div>
            <el-card
              class="product-card"
              v-for="(item, index) in currentRow.project_info"
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
                <div class="bottom">数量：{{ item.count }}</div>
              </div>
            </el-card>
          </div>
        </el-card>
        <br>
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleFormOrder"
            :inline="true"
            label-width="140px"
            class="demo-ruleForm"
          >
            <el-form-item label="交货日期：" prop="delivery_day">
              <el-date-picker
                v-model="ruleForm.delivery_day"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="子女姓名：" prop="children_name">
              <el-input class="value-width" v-model="ruleForm.children_name"></el-input>
            </el-form-item>
            <el-form-item label="子女及联系方式：" prop="children">
              <el-input class="value-width" v-model="ruleForm.children"></el-input>
            </el-form-item>
            <el-form-item label="面料：" prop="material">
              <el-input class="value-width" v-model="ruleForm.material"></el-input>
            </el-form-item>
            <el-form-item label="款式编号：" prop="style_code">
              <el-input class="value-width" v-model="ruleForm.style_code"></el-input>
            </el-form-item>
            <el-form-item label="制作要求：" prop="remark" style="display: block;">
              <el-input
                style="width: 500px;"
                type="textarea"
                maxlength="250"
                show-word-limit
                :rows="8"
                placeholder="请输入制作要求、样式修改等"
                v-model="ruleForm.remark"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrderConfirm('ruleFormOrder')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import buttonOption from "@/components/buttonOption";
import { exportExcel } from "@/utils"
export default {
  components: {
    buttonOption
  },
  data() {
    return {
      isLoading: false,
      params: {
        currentPage: 1,
        pageSize: 10,
        book_status: '0'
      },
      total: 0,
      productInfo: [],
      tableData: [],
      createOrderVisible: false,
      currentRow: {},
      ruleForm: {},
      rules: {
        delivery_day: [{ required: true, message: "请输入交货日期" }],
        children: [{ required: true, message: "请输入子女联系方式" }],
        children_name: [{ required: true, message: "请输入子女姓名" }],
        material: [{ required: true, message: "请输入面料信息" }],
        style_code: [{ required: true, message: "请输入款式编码" }],
        remark: [{ required: true, message: "请输入制作要求，如果无制作要求，请输入暂无" }],
      }
    };
  },
  mounted() {
    if (this.$route.query.phone) {
      this.params.sellerPhone = this.$route.query.phone
    }
    this.getDataList();
  },
  methods: {
    getDataList() {
      // this.isLoading = true;
      // this.params.book_status = this.params.book === '-1' ? '' : this.params.book
      this.$http({
        url: this.$http.adornUrl("/sys/customer/list"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.data;
          this.total = data.data.total;
          // this.totalPage = data.page.totalCount;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    onChange() {
      this.getDataList();
    },
    createOrder(row) {
      this.currentRow = row;
      this.createOrderVisible = true;
    },
    handleOrderClose() {
      this.ruleForm = {};
      this.createOrderVisible = false;
    },
    createOrderConfirm(formName) {
      if(!this.currentRow.project_info || this.currentRow.project_info.length === 0) {
        this.$message({
            message: "至少选择一种库存产品!",
            type: "error"
          });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createOrderApi();
          this.createOrderVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    exportExcel() {
      exportExcel('/sys/customer/download', this.params)
    },
    createOrderApi() {
      this.$http({
        url: this.$http.adornUrl("/sys/order/save"),
        method: "post",
        data: this.$http.adornData({
          customer_id: this.currentRow.id,
          ...this.ruleForm
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$router.push("/order-manage");
          this.$message({
            message: "创建订单成功!",
            type: "success"
          });
        }
      });
    },
    followOrder(row) {
      this.$router.push(`/follow-list?id=${row.id}`);
    },
    update(row) {
      this.$router.push(`/customer-add?id=${row.id}`);
    },
    deleteRow(row) {
      this.$confirm("确认删除当前客户？")
        .then(_ => {
          this.deleteApi(row);
        })
        .catch(_ => {});
    },
    deleteApi(row) {
      this.$http({
        url: this.$http.adornUrl("/sys/customer/delete"),
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
    onAdd() {
      this.$router.push("/customer-add");
    },
    onBack() {
      this.$router.push("/user-salesperson");
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
<style lang="scss">
.value-width {
  width: 220px;
  display: inline-block;
}
.customer-manage {
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
}
</style>

