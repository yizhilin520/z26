<template>
  <table cellspacing="0" cellpadding="0" border="1" class="time_table">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th v-for="it in todayNum" :key="it.hour">
          {{ `${it.hour >= 10 ? it.hour : "0" + it.hour}点` }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="3">今日</td>
        <td rowspan="1" class="play_style">总播放</td>
        <td v-for="it in todayNum" :key="it.hour">
          {{ it.count }}
        </td>
      </tr>
      <tr>
        <td rowspan="1" class="play_style">iOS播放</td>
        <td v-for="it in iosTodayNum" :key="it.hour">
          {{ it.count }}
        </td>
      </tr>
      <tr>
        <td rowspan="1" class="play_style">安卓播放</td>
        <td v-for="it in azTodayNum" :key="it.hour">
          {{ it.count }}
        </td>
      </tr>
      <tr>
        <td rowspan="3">昨日</td>
        <td rowspan="1" class="play_style">总播放</td>
        <td v-for="it in yesterdayNum" :key="it.hour">
          {{ it.count }}
        </td>
      </tr>
      <tr>
        <td rowspan="1" class="play_style">iOS播放</td>
        <td v-for="it in iosYesterdayNum" :key="it.hour">
          {{ it.count }}
        </td>
      </tr>
      <tr>
        <td rowspan="1" class="play_style">安卓播放</td>
        <td v-for="it in azYesterdayNum" :key="it.hour">
          {{ it.count }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    todayNum: {
      type: Array,
      default: []
    },
    iosTodayNum: {
      type: Array,
      default: []
    },
    azTodayNum: {
      type: Array,
      default: []
    },
    yesterdayNum: {
      type: Array,
      default: []
    },
    iosYesterdayNum: {
      type: Array,
      default: []
    },
    azYesterdayNum: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="scss" scoped>
.time_table {
  width: 100%;
  border-spacing: 0;
  border: 1px solid #979797;
  border-collapse: collapse;
  table-layout: fixed;
  // min-height: 150px;
  th,
  td {
    padding: 10px 0px;
    color: #6e7177;
    text-align: center;
    line-height: 1.5;
  }
  th {
    background: rgb(73, 213, 255);
    font-weight: 500;
  }
  td {
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>