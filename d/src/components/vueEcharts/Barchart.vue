<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { Loading } from "element-ui";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
      //   required: true,
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      handler(val) {
        this.setOptions(val);
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
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
    setOptions({ dateList, countList, name } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          // itemWidth: 10,
          // itemHeight: 10,
          dtat: dateList,
          // 重写legend显示样式
          formatter: function(name) {
            // 获取legend显示内容
            let data = countList;
            let total = 0;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            let p = ((tarValue / total) * 100).toFixed(2);
            if (isNaN(p)) return name + " " + " " + 0 + "%";
            return name + " " + " " + p + "%";
          }
        },
        series: [
          {
            name: name,
            type: "pie",
            radius: ["30%", "50%"],
            center: ["50%", "60%"],
            avoidLabelOverlap: true, //防止文字重叠，默认开启
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            label: {
              show: true
            },
            labelLine: {
              show: true,
              length: 30,
              length2: 20
            },
            data: countList
          }
        ]
      });
    }
  }
};
</script>
