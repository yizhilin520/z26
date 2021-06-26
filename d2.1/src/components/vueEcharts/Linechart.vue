<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    percent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      handler(val) {
        this.setOptions(val, true);
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    // console.log("this.chartData :>> ", this.chartData);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, actualData, dateData, nameData } = {}) {
      let that = this;
      this.chart.setOption({
        xAxis: {
          data: dateData,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: dateData.length > 10 ? 30 : 0, // 文字倾斜度
          },
        },
        grid: {
          left: 20,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   type: "cross",
          // },
          padding: [5, 10],
          formatter: function (params) {
            let result = "";
            params.forEach(function (item) {
              if (that.percent) {
                if (item.value) {
                  result +=
                    item.marker +
                    " " +
                    item.seriesName +
                    " : " +
                    Number(item.value * 100).toFixed(2) +
                    "%</br>";
                } else {
                  result += item.marker + " " + item.seriesName + " :  - </br>";
                }
              } else {
                result +=
                  item.marker +
                  " " +
                  item.seriesName +
                  " : " +
                  item.value +
                  "</br>";
              }
            });
            return result;
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          type: "value",
          axisLabel: {
            show: true,
            interval: "auto",
            // formatter: that.percent ? "{value} %" : "{value}", //纵坐标百分比
            formatter: (value) => {
              return that.percent ? `${Number(value * 100)} %` : value;
            },
          },
        },
        legend: {
          data: nameData && nameData.length > 0 ? nameData : ["苹果", "安卓"],
        },
        series: [
          {
            name: nameData && nameData.length > 0 ? nameData[0] : "苹果",
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: expectedData,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: nameData && nameData.length > 0 ? nameData[1] : "安卓",
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
        ],
      });
    },
  },
};
</script>
