<template>
  <div class="container">
    <div class="text">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: "MadouHome",
  data() {
    return {
      text: "敬请期待!",
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  min-height: 80vh;
  text-align: center;
  .text {
    color: #333;
    font-size: 20px;
  }
}
</style>
