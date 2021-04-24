<template>
  <el-upload
    :action="url"
    :before-upload="beforeUploadHandle"
    :on-success="successHandle"
    :on-error="errorHandle"
    :show-file-list="false"
  >
    <div class="upload-file-model" v-loading="isLoading" element-loading-text="文件上传中">
      <i class="el-icon-plus"></i>
    </div>
  </el-upload>
</template>

<script>
export default {
  props: {
    fileSize: {
      type: Number,
      default: 5 // 单位：M
    }
  },
  data() {
    return {
      visible: false,
      url: "",
      num: 0,
      successNum: 0,
      fileList: [],
      isLoading: false
    };
  },
  methods: {
    init(id) {
      this.url = this.$http.adornUrl(
        `/sys/oss/upload?token=${this.$cookie.get("token")}`
      );
      this.visible = true;
    },
    // 上传之前
    beforeUploadHandle(file) {
      if (file.size / 1000 / 1000 > this.fileSize) {
        this.$message({
          message: `视频大小限制在${this.fileSize}M以内`,
          type: "error"
        });
        return false;
      }
      this.isLoading = true;
      this.$emit("before-upload-handle", file);
    },
    // 上传成功
    successHandle(response, file, fileList) {
      this.fileList = fileList;
      this.successNum++;
      this.$emit("upload-success", response);
      if (response && response.code === 0) {
        this.$message({
          message: `上传成功`,
          type: "success"
        });
        // if (this.num === this.successNum) {
        //   this.$confirm("操作成功, 是否继续操作?", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        //   }).catch(() => {
        //     this.visible = false;
        //   });
        // }
      } else {
        this.$message.error(response.msg);
      }
      this.isLoading = false;
    },
    errorHandle(err) {
      this.$emit("on-error", err);
      this.$message({
        message: `上传失败，请检查网络后重试`,
        type: "error"
      });
      this.isLoading = false;
    },
    // 弹窗关闭时
    closeHandle() {
      this.fileList = [];
      this.$emit("refreshDataList");
    }
  }
};
</script>
<style lang="scss">
.upload-file-model {
  width: 120px;
  height: 120px;
  border: 1px dashed #c5c5c5;
  display: flex;
  align-items: center;
  justify-content: center;
  > i {
    font-size: 55px;
    color: #d4d4d4;
  }
  .el-loading-spinner {
    top: 30%;
  }
}
</style>
