<template>
  <div class="notify-content">
    <div class="notify-title">
      <div
        v-for="(item, index) in buttons"
        :key="'item' + index"
        class="title-item"
        :class="[messageType === index ? 'active' : '']"
        @click="changeType(index)"
      >
        {{ item }}
      </div>
    </div>
    <div class="notify-box">
      <ul>
        <li
          v-for="(row, index) in data.list"
          :key="`notify_item_${index}`"
          class="notify-item"
        >
          <p class="notify-str">
            <span v-text="`${row.title} ${row.content}`"/>
            <span v-if="row.type === 2" class="detail" @click="onJumpPage(row.url)">查看详情&gt;</span>
          </p>
          <div class="notify-meta">
            <span v-if="row.type === 1" class="meta-type">#消息</span>
            <span v-else class="meta-type">#公告</span>
            <span v-text="row.createTimeString"/>
          </div>
        </li>
      </ul>
    </div>
    <Page
      v-if="!data.loading && data.total"
      align="center"
      :current.sync="queryData.currentPage"
      :page-size="queryData.pageSize"
      :total="data.total"
      @on-change="getPageData"
    />
    <Spin
      v-if="data.loading"
      size="large"
      fix
    />
  </div>
</template>
<script type="text/javascript">
import {Spin} from 'iview'
import 'iview/dist/styles/iview.css'
import Page from '../components/page'
import * as ProfessorService from '@/servers/professor'
import {HttpCode} from "@/enums";
import $warning from '../../plugins/toast'

export default {
  components: {
    Spin,
    Page
  },
  props: {
    userId: null,
    history: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      queryData: {
        currentPage: 1,
        pageSize: 6
      },
      data: {
        total: 0,
        loading: true,
        list: []
      },
      // buttons: ['全部通知', '消息', '公告'],
      buttons: ['消息'],
      // messageType: 0
      // 默认为消息
      messageType: 1
    }
  },
  beforeMount() {
    this.getPageData()
  },
  methods: {
    // 跳转页面
    onJumpPage(url) {
      this.history.push(url)
    },
    $judgeCode(code) {
      return HttpCode.SUCCESS === code
    },
    changeType(index) {
      this.messageType = index
      this.getPageData()
    },
    async getPageData() {
      const {$judgeCode, queryData, userId, messageType} = this
      const params = {
        userId: userId,
        pageNo: queryData.currentPage,
        pageSize: queryData.pageSize,
        type: messageType === 0 ? null : messageType
      }
      this.data.loading = true
      try {
        const {
          data: {
            msg,
            code,
            data: {list, pageNo, pageSize, total}
          }
        } = await ProfessorService.getMessageList(params).toPromise()
        if (!$judgeCode(code)) return $warning(msg)
        this.queryData.currentPage = pageNo
        this.queryData.pageSize = pageSize

        this.data.total = total
        this.data.list = [{
          title: '《专家号入驻合作协议》',
          content: '',
          type: 2,
          createTimeString: '2021-04-07 17:36:03',
          url: '/protocol/expert',
        }, {
          title: '专家号发文规范',
          content: '',
          type: 2,
          createTimeString: '2021-04-07 17:36:03',
          url: '/protocol/expert/article'
        }].concat(list || [])
      } catch (e) {
      } finally {
        this.data.loading = false
      }
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
.notify-content {
  position: relative;
  padding: 18px 43px 25px 43px;

  .notify-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #D8DCE7;

    &:before, &:after {
      content: '';
      display: table;
      clear: both;
    }

    .title-item {
      position: relative;
      float: left;
      margin-right: 66px;
      padding: 0 8px;
      height: 25px;
      line-height: 25px;
      font-size: 16px;
      color: #363636;
      box-sizing: content-box;
      cursor: pointer;

      &.active, &:hover {
        color: $textColor;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -11px;
          width: 100%;
          height: 1px;
          background-color: $textColor;
        }
      }
    }
  }

  .notify-box {
    margin-top: 10px;

    .notify-item {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .notify-meta {
      margin-top: 8px;
      font-size: 12px;
      color: #949bb1;

      .meta-type {
        padding-right: 14px;
        font-size: 14px;
        font-weight: 600;
        color: $textColor;
      }
    }

    .notify-str {
      font-size: 14px;
      color: #14162C;
      line-height: 26px;

      .detail {
        color: $textColor;
        cursor: pointer;
      }
    }
  }
}
</style>