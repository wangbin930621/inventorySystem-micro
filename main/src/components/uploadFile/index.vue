<template>
  <div class="upload-file">
    <div class="upload_img_model" v-for="(item, index) in list" :key="`upload_${index}`">
      <i v-if="!readonly" class="el-icon-circle-close" @click="removeImg(index)"></i>
      <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="list"></el-image>
    </div>
    <upload v-if="!readonly" ref="upload" :file-size="150" @upload-success="uploadSuccess" @on-error="onError"></upload>
  </div>
</template>
<script>
import upload from "@/views/modules/oss/oss-upload";
import inputImage from "@/components/inputImage";
import videoImg from "@/assets/img/video.png"
import { isVideo } from "@/utils"
export default {
  components: {
    upload,
    inputImage
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    };
  },
  watch: {
    value: {
      handler(value) {
        this.list = value;
      },
      immediate: true
    },
    list(value) {
      this.$emit("input", value);
    }
  },
  mounted() {
    !this.readonly && this.uploadHandle();
  },
  methods: {
    uploadHandle() {
      this.$nextTick(() => {
        this.$refs.upload.init();
      });
    },
    uploadSuccess(response) {
      let url = response.url
      if(isVideo(url)) {
        url = `http://xishifile.oss-cn-hangzhou.aliyuncs.com/202009/13/video.png?url=${url}`
      }
      this.list.push(url);
      this.$emit("handle-upload-success", url);
    },
    onError(err) {

    },
    removeImg(index) {
      this.list.splice(index, 1);
    }
  }
};
</script>
<style lang="scss">
.upload-file {
  display: flex;
  flex-wrap: wrap;
  .upload_img_model {
    position: relative;
    > i {
      position: absolute;
      right: -10px;
      font-size: 22px;
      top: -10px;
      z-index: 100;
    }
  }
  > div {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
