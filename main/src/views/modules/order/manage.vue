<template>
  <div class="order-manage">
    <el-tabs v-model="params.status" type="card" @tab-click="onChange">
      <el-tab-pane key="tab_1" :label="`全部(${staticForm[0] || 0})`" name="0"></el-tab-pane>
      <el-tab-pane key="tab_2" :label="`待付款(${staticForm[1] || 0})`" name="1"></el-tab-pane>
      <el-tab-pane key="tab_3" :label="`待量体/已付款(${staticForm[2] || 0})`" name="2"></el-tab-pane>
      <el-tab-pane key="tab_4" :label="`待审核(${staticForm[3] || 0})`" name="3"></el-tab-pane>
      <el-tab-pane key="tab_5" :label="`审核不通过(${staticForm[4] || 0})`" name="4"></el-tab-pane>
      <el-tab-pane key="tab_6" :label="`审核通过(${staticForm[5] || 0})`" name="5"></el-tab-pane>
      <el-tab-pane key="tab_12" :label="`待发货(${staticForm[12] || 0})`" name="12"></el-tab-pane>
      <el-tab-pane key="tab_7" :label="`待录入三检/生产已发货(${staticForm[6] || 0})`" name="6"></el-tab-pane>
      <el-tab-pane key="tab_8" :label="`待通知客户取件(${staticForm[7] || 0})`" name="7"></el-tab-pane>
      <el-tab-pane key="tab_9" :label="`已通知客户取件(${staticForm[9] || 0})`" name="9"></el-tab-pane>
      <el-tab-pane key="tab_10" :label="`待回访(${staticForm[10] || 0})`" name="10"></el-tab-pane>
      <el-tab-pane key="tab_11" :label="`已完成(${staticForm[11] || 0})`" name="11"></el-tab-pane>
      <el-tab-pane key="tab_13" :label="`返厂修改(${staticForm[13] || 0})`" name="13"></el-tab-pane>
      <el-tab-pane key="tab_14" :label="`退单申请(${staticForm[14] || 0})`" name="14"></el-tab-pane>
      <el-tab-pane key="tab_15" :label="`退单不通过(${staticForm[15] || 0})`" name="15"></el-tab-pane>
      <el-tab-pane key="tab_16" :label="`已退单(${staticForm[16] || 0})`" name="16"></el-tab-pane>
    </el-tabs>
    <br>
    <div class="search-model">
      <div class="_button-left">
        <el-input
          class="input-width-middle"
          :placeholder="`请输入客户名称`"
          v-model="params.name"
          clearable
        ></el-input>
        <el-input
          class="input-width-middle"
          :placeholder="`请输入手机号`"
          v-model="params.phone"
          clearable
        ></el-input>
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
      <el-table-column width="40" align="center" fixed="left">
        <template slot-scope="scope">
          <icon-svg
            name="flag"
            :class="['flag', filterColor((scope.row.mark || {}).type)]"
            @click.native="addRemark(scope.row)"
          ></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="order_code" label="订单编号" width="140" align="center"></el-table-column>
      <el-table-column prop="status" label="订单状态" width="180" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.return_status === 0 || scope.row.return_status === 3">
            <!-- 非退单状态 -->
            <el-tag
              v-if="scope.row.status === 11"
              type="success"
            >{{ scope.row.status | getOrderStatus }}</el-tag>
            <el-tag
              v-else-if="scope.row.status === 13"
              type="danger"
            >{{ scope.row.status | getOrderStatus }}</el-tag>
            <el-tag v-else>{{ scope.row.status | getOrderStatus }}{{scope.row.return_status !== 0 ? (`（${getReturnStatus(scope.row.return_status) }）`) : ''}}</el-tag>
          </div>
          <div v-else>
            <!-- 退单状态 -->
            <el-tag type="danger">{{ getReturnStatus(scope.row.return_status) }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所需商品" width="180" align="center">
        <template slot-scope="scope">
          <div
            v-if="scope.row.appointment.project_info"
          >{{ scope.row.appointment.project_info.map(item => item.name).join('，') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="客户信息" width="220" align="center">
        <template slot-scope="scope">
          <div>{{ (scope.row.appointment || {}).name }}（{{ (scope.row.appointment || {}).phone }}）</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" label="子女信息" width="220" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.children_name || '/' }}（{{ scope.row.children }}）</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="total" label="订单总额(元)" width="120" align="center"></el-table-column>
      <el-table-column prop="deposit" label="定金(元)" width="120" align="center"></el-table-column>
      <el-table-column prop="created_at" label="下单时间" width="160" align="center"></el-table-column>
      <el-table-column prop="shop_name" label="所属门店" width="180" align="center"></el-table-column>
      <el-table-column prop="seller_name" label="所属销售" width="180" align="center"></el-table-column>
      <el-table-column label="标记备注" min-width="250" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.mark">{{ scope.row.mark.remark || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seller_name" label="剩余支付" width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <span>￥{{ remainMoney(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:order:info')"
            type="text"
            size="small"
            @click="goDetail(scope.row)"
          >订单详情</el-button>

          <el-button
            v-if="Number(scope.row.return_status) !== 2 && Number(scope.row.status) === 6 && isAuth('sys:order:modifyProject')"
            type="text"
            size="small"
            @click="goUpdate(scope.row)"
          >寄回修改</el-button>

          <el-button
            v-if="scope.row.modify_info"
            type="text"
            size="small"
            @click="lookUpdate(scope.row)"
          >查看修改</el-button>

          <el-button
            v-if="Number(scope.row.return_status) !== 2 && Number(scope.row.status) === 11 && isAuth('sys:order:info')"
            type="text"
            size="small"
            @click="feedBack(scope.row)"
          >查看回访</el-button>
          <!-- 初始状态，显示定金录入 -->
          <el-button
            v-if="Number(scope.row.return_status) !== 2 && Number(scope.row.status) === 1 && isAuth('sys:order:deposit')"
            type="text"
            size="small"
            @click="setDeposit(scope.row)"
          >金额录入</el-button>
          <!-- 付完定金，开始量体-待审核 -->
          <el-button
            v-if="Number(scope.row.return_status) !== 2 && Number(scope.row.status) === 2 && isAuth('sys:order:figure')"
            type="text"
            size="small"
            @click="setBody(scope.row)"
          >量体录入</el-button>
          <!-- 量体完，店长审核-待提交 -->
          <el-popover
            v-if="Number(scope.row.return_status) !== 2 && (Number(scope.row.status) === 3 || Number(scope.row.status) === 4) && isAuth('sys:order:managerReview')"
            :ref="scope.row.id"
            trigger="click"
            placement="left"
            width="160"
          >
            <p>请店长审核此订单？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="text" size="mini" @click="noPass(scope.row)">不通过</el-button>
              <el-button size="mini" type="primary" @click="pass(scope.row)">通过</el-button>
            </div>
            <el-button
              slot="reference"
              type="text"
              size="small"
              @click="setExamine"
              style="margin: 0 10px;"
            >订单审核</el-button>
          </el-popover>
          <!-- 提交订货 -->
          <el-button
            v-if="Number(scope.row.return_status) !== 2 && Number(scope.row.status) === 5 && isAuth('sys:order:factoryOrder')"
            type="text"
            size="small"
            @click="setFactoryOrder(scope.row)"
          >生产订货</el-button>
          <!-- 生产到货后，录入三检-待取件 -->
          <el-button
            v-if="Number(scope.row.return_status) !== 2 && Number(scope.row.status) === 6 && isAuth('sys:order:sanJian')"
            type="text"
            size="small"
            @click="setSanJian(scope.row)"
          >录入三检</el-button>
          <!-- 通知取件-已通知 -->
          <el-popover
            v-if="Number(scope.row.return_status) !== 2 && (Number(scope.row.status) === 7 || Number(scope.row.status) === 8) && isAuth('sys:order:customerNotify')"
            :ref="`notice_${scope.row.id}`"
            trigger="click"
            placement="left"
            width="160"
          >
            <p>是否通知客户取件？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="text" size="mini" @click="noNotice(scope.row)">取消</el-button>
              <el-button size="mini" type="primary" @click="isNotice(scope.row)">通知</el-button>
            </div>
            <el-button
              slot="reference"
              type="text"
              size="small"
              @click="notice(scope.row)"
              style="margin: 0 10px;"
            >通知取件</el-button>
          </el-popover>
          <!-- 退货申请 -->
          <el-button
            v-if="(Number(scope.row.return_status) === 0 || Number(scope.row.return_status) === 3) && Number(scope.row.status) !== 10 && Number(scope.row.status) !== 11 && isAuth('sys:order:requestReturn')"
            type="text"
            size="small"
            @click="requestReturn(scope.row)"
          >退货申请</el-button>
          <!-- 取消退货申请 -->
          <el-button
            v-if="Number(scope.row.return_status) === 1 && isAuth('sys:order:requestReturn')"
            type="text"
            size="small"
            @click="cancelReturn(scope.row)"
          >取消退货</el-button>
          <!-- 退货审核 -->
          <el-button
            v-if="Number(scope.row.return_status) === 1 && isAuth('sys:order:reviewReturn')"
            type="text"
            size="small"
            @click="returnBtn(scope.row)"
            style="margin-left: 10px;"
          >退货审核</el-button>
          <!-- 完成付款 -->
          <el-button
            v-if="Number(scope.row.status) === 9 && isAuth('sys:order:customerGet')"
            type="text"
            size="small"
            @click="completePay(scope.row)"
          >完成交易</el-button>
          <!-- 取件后，待回访 -->
          <el-button
            v-if="Number(scope.row.status) === 10 && isAuth('sys:order:feedback')"
            type="text"
            size="small"
            @click="setReview(scope.row)"
          >客户回访</el-button>
          <!-- 查看回访 -->
          <!-- <el-button
            v-if="Number(scope.row.status) === 11 && isAuth('order:manage:11')"
            type="text"
            size="small"
            @click="watchReview(scope.row)"
          >回访详情</el-button>-->
          <!-- 完成 -->
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

    <!-- 定金录入 -->
    <el-dialog title="定金录入" :visible.sync="depositVisible" width="800px">
      <el-form
        :model="depositForm"
        :rules="depositRules"
        ref="depositRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="订单总额" prop="total" required>
          <el-input class="input-width" v-model="depositForm.total"></el-input>&nbsp;元
        </el-form-item>
        <el-form-item label="订单预付款" prop="deposit" required>
          <el-input class="input-width" v-model="depositForm.deposit"></el-input>&nbsp;元
        </el-form-item>
        <el-form-item label="预支付日期" prop="arrears_day" required>
          <el-date-picker
            v-model="depositForm.arrears_day"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择定金支付日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="depositVisible = false">取 消</el-button>
        <el-button type="primary" @click="depositConfirm('depositRuleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 量体录入 -->
    <el-dialog title="量体录入" :visible.sync="bodyVisible" width="90%">
      <el-form
        :model="bodyForm"
        :rules="bodyRules"
        :inline="true"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="胸围：" prop="chestCircle">
          <el-input class="input-width" v-model="bodyForm.data.chestCircle"></el-input>
        </el-form-item>
        <el-form-item label="胸高：" prop="chestHeight">
          <el-input class="input-width" v-model="bodyForm.data.chestHeight"></el-input>
        </el-form-item>
        <el-form-item label="胸距：" prop="chestDistance">
          <el-input class="input-width" v-model="bodyForm.data.chestDistance"></el-input>
        </el-form-item>
        <el-form-item label="前胸宽：" prop="chestWidth">
          <el-input class="input-width" v-model="bodyForm.data.chestWidth"></el-input>
        </el-form-item>
        <el-form-item label="后背宽：" prop="backWidth">
          <el-input class="input-width" v-model="bodyForm.data.backWidth"></el-input>
        </el-form-item>
        <el-form-item label="中腰：" prop="midWaist">
          <el-input class="input-width" v-model="bodyForm.data.midWaist"></el-input>
        </el-form-item>
        <el-form-item label="裤腰：" prop="pantsWaist">
          <el-input class="input-width" v-model="bodyForm.data.pantsWaist"></el-input>
        </el-form-item>
        <el-form-item label="前、后腰长：" prop="frontBackWaist">
          <el-input class="input-width" v-model="bodyForm.data.frontBackWaist"></el-input>
        </el-form-item>
        <el-form-item label="臀围：" prop="hipCircle">
          <el-input class="input-width" v-model="bodyForm.data.hipCircle"></el-input>
        </el-form-item>
        <el-form-item label="臀高：" prop="hipHeight">
          <el-input class="input-width" v-model="bodyForm.data.hipHeight"></el-input>
        </el-form-item>
        <el-form-item label="肚围：" prop="bellyCircle">
          <el-input class="input-width" v-model="bodyForm.data.bellyCircle"></el-input>
        </el-form-item>
        <el-form-item label="肚高：" prop="bellyHeight">
          <el-input class="input-width" v-model="bodyForm.data.bellyHeight"></el-input>
        </el-form-item>
        <el-form-item label="肩宽：" prop="shoulderWidth">
          <el-input class="input-width" v-model="bodyForm.data.shoulderWidth"></el-input>
        </el-form-item>
        <el-form-item label="横开领：" prop="horOpenNeck">
          <el-input class="input-width" v-model="bodyForm.data.horOpenNeck"></el-input>
        </el-form-item>
        <el-form-item label="前后直开领：" prop="frontBackStraightOpenNeck">
          <el-input class="input-width" v-model="bodyForm.data.frontBackStraightOpenNeck"></el-input>
        </el-form-item>
        <el-form-item label="领围：" prop="neckCircle">
          <el-input class="input-width" v-model="bodyForm.data.neckCircle"></el-input>
        </el-form-item>
        <el-form-item label="领高：" prop="neckHeight">
          <el-input class="input-width" v-model="bodyForm.data.neckHeight"></el-input>
        </el-form-item>
        <el-form-item label="衣长：" prop="clothLength">
          <el-input class="input-width" v-model="bodyForm.data.clothLength"></el-input>
        </el-form-item>
        <el-form-item label="裙长：" prop="dressLength">
          <el-input class="input-width" v-model="bodyForm.data.dressLength"></el-input>
        </el-form-item>
        <el-form-item label="裤长：" prop="pantsLength">
          <el-input class="input-width" v-model="bodyForm.data.pantsLength"></el-input>
        </el-form-item>
        <el-form-item label="内增长：" prop="inAddLength">
          <el-input class="input-width" v-model="bodyForm.data.inAddLength"></el-input>
        </el-form-item>
        <el-form-item label="袖长：" prop="sleeveLength">
          <el-input class="input-width" v-model="bodyForm.data.sleeveLength"></el-input>
        </el-form-item>
        <el-form-item label="外袖长：" prop="outerSleeveLength">
          <el-input class="input-width" v-model="bodyForm.data.outerSleeveLength"></el-input>
        </el-form-item>
        <el-form-item label="袖笼围：" prop="sleeveCageCircle">
          <el-input class="input-width" v-model="bodyForm.data.sleeveCageCircle"></el-input>
        </el-form-item>
        <el-form-item label="袖肥：" prop="sleeveWidth">
          <el-input class="input-width" v-model="bodyForm.data.sleeveWidth"></el-input>
        </el-form-item>
        <el-form-item label="袖口：" prop="sleeveCuff">
          <el-input class="input-width" v-model="bodyForm.data.sleeveCuff"></el-input>
        </el-form-item>
        <el-form-item label="袖档：" prop="sleeveCrotch">
          <el-input class="input-width" v-model="bodyForm.data.sleeveCrotch"></el-input>
        </el-form-item>
        <el-form-item label="直档：" prop="straightCrotch">
          <el-input class="input-width" v-model="bodyForm.data.straightCrotch"></el-input>
        </el-form-item>
        <el-form-item label="脚口：" prop="footMouth">
          <el-input class="input-width" v-model="bodyForm.data.footMouth"></el-input>
        </el-form-item>
        <el-form-item label="大脚围：" prop="footCircle">
          <el-input class="input-width" v-model="bodyForm.data.footCircle"></el-input>
        </el-form-item>
        <el-form-item label="叉高：" prop="ventHeight">
          <el-input class="input-width" v-model="bodyForm.data.ventHeight"></el-input>
        </el-form-item>
        <el-form-item label="身高：" prop="bodyHeight">
          <el-input class="input-width" v-model="bodyForm.data.bodyHeight"></el-input>
        </el-form-item>
        <el-form-item label="体重：" prop="bodyWeight">
          <el-input class="input-width" v-model="bodyForm.data.bodyWeight"></el-input>
        </el-form-item>
        <el-form-item label="体型：" prop="figure">
          <el-select
            v-model="bodyForm.figure"
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
        <el-form-item label="量体图片：" prop="images" style="display: block;">
          <upload-file v-model="bodyForm.images"/>
        </el-form-item>
        <el-form-item label="量体备注：" prop="remark" style="display: block;">
          <el-input
            type="textarea"
            :rows="8"
            maxlength="250"
            show-word-limit
            v-model="bodyForm.data.remark"
            style="width: 500px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bodyVisible = false">取 消</el-button>
        <el-button type="primary" @click="bodyConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 生产订货 -->
    <el-dialog title="生产订货" :visible.sync="factoryOrderVisible" width="400">
      <el-form
        :model="factoryOrderForm"
        :rules="factoryOrderRules"
        ref="factoryOrderruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="预计交货日期" prop="plan_delivery_day" required>
          <el-date-picker
            v-model="factoryOrderForm.plan_delivery_day"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="factoryOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="factoryOrderConfirm('factoryOrderruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 返回修改 -->
    <el-dialog title="返回修改" :visible.sync="updateVisible" width="800px">
      <el-form
        :model="updateForm"
        :rules="updateRules"
        ref="updateruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="修改产品" prop="project_id" required>
          <el-select v-model="updateForm.project_id" placeholder="请选择">
            <el-option
              v-for="item in ((currentRow.appointment || {}).project_info || [])"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" placeholder="请输入修改备注信息" v-model="updateForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <upload-file v-model="updateForm.images"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm('updateruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 申请退货 -->
    <el-dialog :title="`${isReturn ? '退货审核' : '申请退货'}`" :visible.sync="returnVisible" width="800px">
      <el-form
        :model="returnForm"
        :rules="returnRules"
        ref="returnruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="退货理由" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入修改备注信息"
            v-model="returnForm.remark"
            :readonly="isReturn"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <upload-file v-model="returnForm.images" :readonly="isReturn"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <template v-if="!isReturn">
          <el-button @click="returnVisible = false">取 消</el-button>
          <el-button type="primary" @click="returnConfirm('returnruleForm')">确 定</el-button>
        </template>
        <template v-else>
          <el-button @click="returnReview(3)">拒 绝</el-button>
          <el-button type="primary" @click="returnReview(2)">通 过</el-button>
        </template>
      </span>
    </el-dialog>

    <!-- 三检 -->
    <el-dialog title="客户三检" :visible.sync="sanJianVisible" width="800px">
      <el-form
        :model="sanjianForm"
        :rules="sanjianRules"
        ref="sanJianRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="日期：" required>
          <el-date-picker
            v-model="sanjianForm.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="三检人员：" prop="name" required>
          <el-input placeholder="请输入三检人员" v-model="sanjianForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编号：" prop="code" required>
          <el-input placeholder="请输入编号" v-model="sanjianForm.code"></el-input>
        </el-form-item>
        <el-form-item label="三检信息：" required>
          <el-input type="textarea" :rows="3" placeholder="请输入三检信息" v-model="sanjianForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="三检图片：">
          <upload-file v-model="sanjianForm.images"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sanJianVisible = false">取 消</el-button>
        <el-button type="primary" @click="sanJianConfirm('sanJianRuleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加订单备注 -->
    <el-dialog title="添加备注" :visible.sync="remarkVisible" width="800px">
      <el-form
        :model="remarkForm"
        :rules="remarkRules"
        ref="remarkRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标记类型：" prop="type">
          <div class="color-model">
            <i
              v-for="(item, index) in typeOptions"
              :key="index"
              :class="['color-option', item.color]"
              @click="chooseColor(item)"
            >
              <i v-if="remarkForm.type === item.code" class="el-icon-check"></i>
            </i>
          </div>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="250"
            show-word-limit
            placeholder="请输入备注信息"
            v-model="remarkForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarkConfirm('remarkRuleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 完成支付 -->
    <el-dialog title="完成交易" :visible.sync="completePayVisible" width="800px">
      <el-form
        :model="completePayForm"
        ref="completePayRuleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="尾款支付日期：" prop="remain_pay_date" required>
          <el-date-picker
            v-model="completePayForm.remain_pay_date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="实付尾款金额：" prop="remain_money" required>
          <el-input v-model="completePayForm.remain_money"></el-input>
        </el-form-item>
        <el-form-item label="发票图片：" prop="invoice_images" required>
          <upload-file v-model="completePayForm.invoice_images"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="completePayVisible = false">取 消</el-button>
        <el-button type="primary" @click="completePayConfirm('completePayRuleForm')">确 定</el-button>
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
    <!-- 回访信息 -->
    <el-dialog title="回访信息" :visible.sync="feedbackVisible" width="800px">
      <el-form v-if="currentRow.feedback" label-width="120px" class="demo-ruleForm" inline>
        <el-form-item label="总览月份：" prop="overview_month">
          <el-date-picker
            v-model="currentRow.feedback.overview_month"
            class="input-width-middle"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总负责人：" prop="director">
          <el-input class="input-width-middle" v-model="currentRow.feedback.director" readonly></el-input>
        </el-form-item>
        <el-form-item label="督察人：" prop="checker">
          <el-input class="input-width-middle" v-model="currentRow.feedback.checker" readonly></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input class="input-width-middle" v-model="currentRow.feedback.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="微信：" prop="wechat">
          <el-input class="input-width-middle" v-model="currentRow.feedback.wechat" readonly></el-input>
        </el-form-item>
        <el-form-item label="子女信息：" prop="children">
          <el-input class="input-width-middle" v-model="currentRow.feedback.children" readonly></el-input>
        </el-form-item>
        <el-form-item label="婆婆妈妈信息：" prop="mother">
          <el-input class="input-width-middle" v-model="currentRow.feedback.mother" readonly></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input class="input-width-middle" v-model="currentRow.feedback.address" readonly></el-input>
        </el-form-item>
        <el-form-item label="礼服师：" prop="dresser">
          <el-input class="input-width-middle" v-model="currentRow.feedback.dresser" readonly></el-input>
        </el-form-item>
        <el-form-item label="回访门店：" prop="revisit_shop">
          <el-input class="input-width-middle" v-model="currentRow.feedback.revisit_shop" readonly></el-input>
        </el-form-item>
        <el-form-item label="回访日期：">
          <el-date-picker
            class="input-width-middle"
            v-model="currentRow.feedback.revisit_date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="满意度：" prop="satisfaction" style="display: block;">
          <upload-file v-if="currentRow.satisfaction" v-model="currentRow.satisfaction" readonly/>
        </el-form-item>
        <el-form-item label="备注：" prop="desc" style="display: block;">
          <el-input
            type="textarea"
            :rows="4"
            v-model="currentRow.feedback.remark"
            readonly
            style="width: 500px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="feedbackVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import buttonOption from "@/components/buttonOption";
import { orderStatus, returnStatus } from "@/utils/status";
import uploadFile from "@/components/uploadFile";
import { isAuth } from "@/utils";
export default {
  components: {
    buttonOption,
    uploadFile
  },
  filters: {
    getOrderStatus(t) {
      return orderStatus(t);
    },
  },
  data() {
    return {
      isLoading: false,
      feedbackVisible: false,
      params: {
        name: "",
        order_code: "",
        phone: "",
        currentPage: 1,
        pageSize: 10,
        status: "0"
      },
      updateInfo: [],
      total: 0,
      tableData: [],
      status: 1,
      currentRow: {},
      depositVisible: false,
      visitVisible: false,
      bodyVisible: false,
      inspectionsVisible: false,
      factoryOrderVisible: false,
      sanJianVisible: false,
      completePayVisible: false,
      remarkVisible: false,
      updateVisible: false,
      returnVisible: false,
      remarkForm: {
        type: 1
      },
      remarkRules: {
        type: [{ required: true, message: "请选择标记颜色" }]
      },
      currentColor: -1,
      depositForm: {},
      depositRules: {},
      updateInfoVisible: false,
      returnForm: {
        images: []
      },
      returnRules: {},
      updateForm: {
        images: []
      },
      updateRules: {
        code: [{ required: true, message: "请选择至少一个订单商品" }]
      },
      factoryOrderForm: {},
      factoryOrderRules: {
        plan_delivery_day: [{ required: true, message: "请选择预计交货日期" }]
      },
      sanjianForm: {},
      sanjianRules: {},
      staticForm: {},
      bodyForm: {
        figure: [],
        data: {},
        images: []
      },
      sendInfo: {}, // 生产发货详情
      completePayForm: {
        invoice_images: []
      },
      isReturn: false,
      bodyRules: {},
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
      ],
      typeOptions: [
        {
          code: 1,
          color: "bg-color-red"
        },
        {
          code: 2,
          color: "bg-color-yellow"
        },
        {
          code: 3,
          color: "bg-color-blue"
        },
        {
          code: 4,
          color: "bg-color-green"
        },
        {
          code: 5,
          color: "bg-color-purple"
        },
        {
          code: 6,
          color: "bg-color-black"
        }
      ]
    };
  },
  computed: {
    totalOrders() {
      const values = Object.values(this.staticForm);
      return values.length > 0 ? values.reduce((total, num) => total + num) : 0;
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.isLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/order/list"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.data.forEach(item => (item.show = false));
          this.tableData = data.data.data;
          this.total = data.data.total;
          this.getStatic(); // 订单状态统计
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.isLoading = false;
      });
    },
    getReturnStatus(t) {
      return returnStatus(t);
    },
    getStatic() {
      this.$http({
        url: this.$http.adornUrl("/sys/stat/orderHead"),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.staticForm = data.data;
          console.log(this.staticForm);
        }
      });
    },
    filterColor(type) {
      const obj = this.typeOptions.find(
        item => Number(item.code) === Number(type)
      );
      return `${((obj || {}).color || "font-color-default").replace("bg", "font")}`;
    },
    onChange() {
      this.getDataList();
    },
    setDeposit(row) {
      console.log('row---', row)
      this.depositVisible = true;
      this.currentRow = row;
    },
    setBody(row) {
      this.bodyVisible = true;
      this.currentRow = row;
      this.bodyForm = {
        figure: [],
        data: {},
        images: []
      };
    },
    setExamine(row) {
      this.currentRow = row;
    },
    goUpdate(row) {
      this.currentRow = row;
      this.updateVisible = true;
    },
    lookUpdate(row) {
      this.currentRow = row;
      this.updateInfoVisible = true
      this.updateInfo = this.filterUpdateInfo(row)
    },
    filterUpdateInfo(row) {
      console.log(row.appointment.project_info)
      const projectInfo = row.appointment.project_info
      const modifyInfo = row.modify_info
      const filterData = []
      for(let o in modifyInfo) {
        console.log(o, modifyInfo[o])
        filterData.push({
          ...{modifyInfo: modifyInfo[o] || {}},
          ...(projectInfo.find(item => Number(item.id) === Number(o)))
        })
      }
      console.log('filterData: ', filterData)
      return filterData
    },
    addRemark(row) {
      if (!isAuth("sys:order:mark")) {
        this.$message({
          message: "暂无标记权限",
          type: "error"
        });
        return;
      }
      this.remarkVisible = true;
      const { type = 1, remark = "" } = row.mark || {};
      this.remarkForm = {
        type,
        remark
      };
      this.currentRow = row;
    },
    chooseColor(row) {
      this.remarkForm.type = row.code;
    },
    notice(row) {
      this.currentRow = row;
    },
    returnBtn(row) {
      this.currentRow = row;
      this.returnVisible = true;
      this.isReturn = true;
      this.returnForm = row.return_info || {
        images: []
      };
    },
    completePay(row) {
      this.completePayVisible = true;
      this.currentRow = row;
    },
    requestReturn(row) {
      this.returnVisible = true;
      this.isReturn = false;
      this.currentRow = row;
    },
    cancelReturn(row) {
      this.currentRow = row;
      this.$confirm("是否取消申请退货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.requestReturnAjax({
          status: 0
        });
      });
    },
    setFactoryOrder(row) {
      this.factoryOrderVisible = true;
      this.currentRow = row;
    },
    setSanJian(row) {
      this.sanJianVisible = true;
      this.currentRow = row;
    },
    setReview(row) {
      this.$router.push(`/order-review?id=${row.id}`);
    },
    watchReview(row) {
      this.$router.push(`/order-review?review_id=${row.id}`);
    },
    feedBack(row) {
      this.feedbackVisible = true;
      this.currentRow = row;
      this.currentRow.satisfaction = row.feedback.satisfaction.split(',')
    },
    remainMoney(row) {
      const { total = 0, deposit = 0, remain_money = 0 } = row
      return total - deposit - remain_money
    },
    pass(row) {
      this.examineConfirm(true, row);
    },
    noPass(row) {
      this.examineConfirm(false, row);
    },
    isNotice(row) {
      this.noticeConfirm(true, row);
    },
    noNotice(row) {
      this.$refs[`notice_${row.id}`].doClose();
    },
    returnReview(status) {
      this.reviewReturnAjax({ status });
      this.returnVisible = false;
    },
    reviewReturnAjax({ status = 2 }) {
      return new Promise((resolve, rejects) => {
        this.$http({
          url: this.$http.adornUrl("/sys/order/reviewReturn"),
          method: "post",
          data: this.$http.adornData({
            id: this.currentRow.id,
            status
          })
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: `${status === 2 ? "退货成功" : "退货失败"}`,
                type: "success"
              });
              this.getDataList();
              resolve(data);
            } else {
              rejects(data);
              this.$message.error(data.msg);
            }
          })
          .catch(err => {
            rejects(err);
          });
      });
    },
    depositConfirm(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const { total, deposit, arrears_day } = this.depositForm;
            this.$http({
              url: this.$http.adornUrl("/sys/order/deposit"),
              method: "post",
              data: this.$http.adornData({
                id: this.currentRow.id,
                total,
                deposit,
                arrears_day
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
                this.getDataList();
              } else {
                this.$message.error(data.msg);
              }
            });
            this.depositVisible = false;
          }
      })
    },
    bodyConfirm() {
      const { figure, data, images } = this.bodyForm;
      const json = { ...data, figure };
      this.$http({
        url: this.$http.adornUrl("/sys/order/figure"),
        method: "post",
        data: this.$http.adornData({
          id: this.currentRow.id,
          data: json,
          images
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "设置成功",
            type: "success"
          });
          this.getDataList();
          this.bodyVisible = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    factoryOrderConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { plan_delivery_day } = this.factoryOrderForm;
          this.$http({
            url: this.$http.adornUrl("/sys/order/factoryOrder"),
            method: "post",
            data: this.$http.adornData({
              id: this.currentRow.id,
              plan_delivery_day
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "设置成功",
                type: "success"
              });
              this.getDataList();
              this.factoryOrderVisible = false;
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
    examineConfirm(bool, row) {
      this.$http({
        url: this.$http.adornUrl("/sys/order/managerReview"),
        method: "post",
        data: this.$http.adornData({
          id: row.id,
          status: bool ? 5 : 4
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "审核成功",
            type: "success"
          });
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$refs[row.id].doClose();
    },
    noticeConfirm(bool, row) {
      this.$http({
        url: this.$http.adornUrl("/sys/order/customerNotify"),
        method: "post",
        data: this.$http.adornData({
          id: row.id,
          is_notify: bool ? 1 : 0
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "通知成功",
            type: "success"
          });
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$refs[`notice_${row.id}`].doClose();
    },
    sanJianConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/order/sanJian"),
            method: "post",
            data: this.$http.adornData({
              id: this.currentRow.id,
              ...this.sanjianForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "录入三检成功！",
                type: "success"
              });
              this.getDataList();
              this.sanJianVisible = false;
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
    remarkConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/order/mark"),
            method: "post",
            data: this.$http.adornData({
              id: this.currentRow.id,
              ...this.remarkForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "标记成功！",
                type: "success"
              });
              this.remarkForm = {
                type: 1
              };
              this.getDataList();
            } else {
              this.$message.error(data.msg);
            }
          });
          this.remarkVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/order/modifyProject"),
            method: "post",
            data: this.$http.adornData({
              id: this.currentRow.id,
              ...this.updateForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "提交修改成功！",
                type: "success"
              });
              this.updateForm = {
                images: []
              };
              this.getDataList();
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
    returnConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.requestReturnAjax({
            status: 1
          });
          this.returnVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    requestReturnAjax({ status = 1 }) {
      return new Promise((resolve, rejects) => {
        this.$http({
          url: this.$http.adornUrl("/sys/order/requestReturn"),
          method: "post",
          data: this.$http.adornData({
            id: this.currentRow.id,
            ...this.returnForm,
            status
          })
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: `${
                  status === 1 ? "申请成功，请等待管理员审核！" : "取消退单成功"
                }`,
                type: "success"
              });
              this.getDataList();
              resolve(data);
            } else {
              rejects(data);
              this.$message.error(data.msg);
            }
          })
          .catch(err => {
            rejects(err);
            this.$message.error(err.msg);
          });
      });
    },
    completePayConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/order/customerGet"),
            method: "post",
            data: this.$http.adornData({
              id: this.currentRow.id,
              ...this.completePayForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "交易完成！",
                type: "success"
              });
              this.getDataList();
              this.completePayVisible = false;
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
    goDetail(row) {
      this.$router.push(`/order-detail?id=${row.id}`);
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
.order-manage {
  .flag {
    font-size: 18px;
    cursor: pointer;
  }
  .input-width {
    width: 100px;
  }
  .color-model {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .color-option {
    display: inline-flex;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 10px;
    align-items: center;
    justify-content: center;
    > i {
      color: #fff;
    }
  }
}
</style>


