<template>
  <div class="input-image" :style="{width: `${width}px`, height: `${height}px`}">
    <img :src="src" @click="showBig" />
  </div>
</template>
<script>
export default {
	props: {
		src: {
			type: String,
			default: ''
		},
		width: {
			type: Number,
			default: 80
		},
		height: {
			type: Number,
			default: 80
		},
		fileList: {
			type: Array,
			default() {
				return {}
			}
		}
	},
  data() {
    return {};
	},
	methods: {
		showBig() {
			console.log(this.fileList)
		}
	}
};
</script>
<style lang="scss">
	.input-image{
		>img{
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>

