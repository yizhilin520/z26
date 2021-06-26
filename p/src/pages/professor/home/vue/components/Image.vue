<template lang="pug">
  img(:src="imageSrc" @error="onImageErrorHandle" :style="{objectFit: fit}")
</template>
<script type="text/javascript">
export default {
  props: {
    src: String,
    defaultImage: String,
    fit: null
  },
  data() {
    return {
      loadFlag: false,

      imageSrc: this.src || this.defaultImage
    }
  },
  methods: {
    onImageErrorHandle() {
      const {loadFlag, defaultImage} = this
      if (!loadFlag) {
        this.imageSrc = defaultImage;
        this.loadFlag = true;
      }
    }
  },
  watch: {
    src(v) {
      this.imageSrc = v
      this.loadFlag = false;
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
</style>