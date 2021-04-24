<template>
  <div class="statistics-add">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="报表名称" prop="name">
        <el-input class="input-width-middle" v-model="ruleForm.name"></el-input>&nbsp;&nbsp;
        <el-button type="text" @click="addOnlineChannel">添加线上渠道</el-button>
        <el-button type="text" @click="addOfflineChannel">添加线下渠道</el-button>
      </el-form-item>
      <el-form-item label="报表类型" prop="type">
        <el-radio v-model="ruleForm.type" :label="1">月度</el-radio>
        <el-radio v-model="ruleForm.type" :label="2">年度</el-radio>
      </el-form-item>
      <el-form-item label="报表年月" prop="year_month">
        <el-date-picker
          v-model="ruleForm.year_month"
          value-format="yyyyMM"
          type="month"
          placeholder="选择年月">
        </el-date-picker>
      </el-form-item>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="kind" label="分类" width="80" align="center" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.kind === 1">线上</span>
						<span v-else-if="scope.row.kind === 2">线下</span>
						<span v-else-if="scope.row.kind === 3">其他</span>
						<span v-else-if="scope.row.kind === 4">升级</span>
						<span v-else-if="scope.row.kind === 5">退单</span>
						<span v-else-if="scope.row.kind === 6">合计</span>
          </template>
        </el-table-column>
        <el-table-column prop="channel" label="渠道" width="120" align="center">
          <template slot-scope="scope">
            <el-select v-if="scope.row.kind <= 2" v-model="scope.row.channel" placeholder="请选择">
              <el-option v-for="item in channelOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
						<span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column prop="promotion" label="推广投入" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.promotion"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="client_num" label="客资数" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.client_num"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="reception" label="接待量" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reception"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="entry_rate" label="进店率" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.entry_rate"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="order_count" label="订单数" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.order_count"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="performance_amount" label="业绩金额" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.performance_amount"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="average_price" label="均价" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.average_price"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="performance_percent" label="业绩占比" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.performance_percent"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="customer_get_cost" label="获客成本" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.customer_get_cost"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="order_cost" label="订单成本" width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.order_cost"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="order_cost" label="操作" min-width="60" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.kind <= 2" type="text" @click="deleteChannel(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item style="text-align: right;margin-top: 10px">
        <el-button type="primary" :loading="isLoading" @click="submitForm('ruleForm')">创建报表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: '',
      isLoading: false,
      ruleForm: {
        type: 1,
      },
      rules: {
        name: [{ required: true, message: "请输入报表名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择报表类型", trigger: "blur" }],
        year_month: [{ required: true, message: "请输入报表年月", trigger: "blur" }],
      },
      channelArray: [],
      channelOptions: [],
      onlineTable: [],
			offlineTable: [],
			otherTable: [
				{
					kind: 3,
				},
				{
					kind: 4,
				},
				{
					kind: 5,
				}
			]
    };
  },
  computed: {
    tableData() {
      return [...this.onlineTable, ...this.offlineTable, ...this.otherTable];
    }
  },
  mounted() {
    this.getChannelList();
    if(this.$route.query.id) {
      this.id = this.$route.query.id
      this.isEdit = true
      this.getDetail()
    }
  },
  methods: {
    getChannelList() {
      this.$http({
        url: this.$http.adornUrl("/sys/report/channel"),
        method: "get",
        params: this.$http.adornParams(this.params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.channelOptions = data.data;
        } else {
          this.channelOptions = [];
        }
      });
    },
    getDetail() {
      this.$http({
        url: this.$http.adornUrl(`/sys/report/info/${this.id}`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.channelOptions = data.data;
          const { name, type, data: tableData } = data.data
          const otherTable = []
          let year_month = ''
          tableData.forEach(item => {
            if(item.kind === 1) {
              this.onlineTable.push(item)
            } else if(item.kind === 2) {
              this.offlineTable.push(item)
            } else {
              otherTable.push(item)
            }
            year_month = item.year_month
          });
          this.otherTable = otherTable
          this.ruleForm = {
            name,
            type,
            year_month: String(year_month)
          }
        } else {
          this.channelOptions = [];
        }
      });
    },
    addOnlineChannel() {
      this.onlineTable.push({
				kind: 1
			});
    },
    addOfflineChannel() {
      this.offlineTable.push({
				kind: 2
			});
    },
    deleteChannel(row, index) {
			// console.log(index, index - ((this.onlineTable.length - 1 < 0 ? 0) || 0))
			if(row.kind === 1) {
				this.onlineTable.splice(index, 1);
			} else if(row.kind === 2) {
				this.offlineTable.splice(index - (this.onlineTable.length), 1);
			}
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex === 0 && row.kind === 1) {
        return {
          rowspan: this.onlineTable.length,
          colspan: 1
        };
      } else if (columnIndex === 0 && rowIndex === this.onlineTable.length && row.kind === 2) {
        return {
          rowspan: this.offlineTable.length,
          colspan: 1
        };
      } else if (columnIndex === 0 && rowIndex >= (this.onlineTable.length + this.offlineTable.length) && row.kind >= 2) {
        return {
          rowspan: 1,
          colspan: 1
        };
      } else if (columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    submitForm(formName) {
      this.tableData.map(item => {
        item.year_month = Number(this.ruleForm.year_month)
        return item
      })
      this.ruleForm.data = this.tableData
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
          url: this.$http.adornUrl("/sys/report/save"),
          method: "post",
          data: this.$http.adornData(this.ruleForm)
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: `创建成功`,
                type: "success"
              });
              this.$router.push('/finance-statistics')
            } else {
              this.$message.error(data.msg);
            }
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>
<style lang="scss">
.statistics-add {
  .box-card {
    margin-bottom: 10px;
  }
}
</style>
