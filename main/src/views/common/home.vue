<template>
  <div class="mod-home">
    <template v-if="isAuth('sys:stat:home')">
      <el-card class="card" shadow="always">
        <h4>今日订单</h4>
        <h2>{{ form.today_order || 0 }}</h2>
      </el-card>
      <el-card class="card" shadow="always">
        <h4>累计营业额</h4>
        <h2>{{ form.sum || 0.0 }}元</h2>
      </el-card>
    </template>
    <el-card class="wrapper userInfo" shadow="always">
      <p>
        <i class="el-icon-view"></i>
        &nbsp;&nbsp;{{ userInfo.username || "" }}
      </p>
      <p>
        <i class="el-icon-phone-outline"></i>
        &nbsp;&nbsp;{{ userInfo.mobile || "" }}
      </p>
      <p>
        <i class="el-icon-message"></i>
        &nbsp;&nbsp;{{ userInfo.email || "" }}
      </p>
      <p>
        <i class="el-icon-time"></i>
        &nbsp;&nbsp;{{ userInfo.createTime || "" }}
      </p>
    </el-card>
    <el-card class="wrapper userInfo" shadow="always">
      <Chart :options="barOptions"></Chart>
    </el-card>
    <el-card class="wrapper userInfo" shadow="always">
      <Chart :options="lineOptions"></Chart>
    </el-card>
    <el-card class="wrapper userInfo" shadow="always">
      <Chart :options="circleOptions"></Chart>
    </el-card>
  </div>
</template>

<script>
import { isAuth } from "@/utils";
import Chart from "@/views/chartsDemo";
import {
  barOptions,
  lineOptions,
  circleOptions
} from "@/views/chartsDemo/data";
export default {
  components: {
    Chart
  },
  data() {
    return {
      form: {},
      barOptions,
      lineOptions,
      circleOptions
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
    isAuth("sys:stat:home") && this.getDetail();
  },
  methods: {
    getDetail() {
      this.$http({
        url: this.$http.adornUrl(`/sys/stat/home`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.form = data.data;
        }
        this.isLoading = false;
      });
    }
  }
};
</script>

<style>
.mod-home {
  line-height: 1.5;
}
.card {
  width: 250px;
  display: inline-block;
}
.el-card__body {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.mod-home {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: calc(100vh - 130px);
  .wrapper {
    flex: 0 0 calc(50% - 5px);
    height: calc(50% - 10px);
  }
}
</style>
