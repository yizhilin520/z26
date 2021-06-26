<template>
  <div
    v-show="visible"
    class="ui-widget-modal"
  >
    <div
      class="ivu-drawer-mask v-modal"
      :style="{zIndex}"
      @click="showCancel"
    />

    <div
      class="modal-warp"
      :style="{zIndex}"
    >
      <div class="modal-inner">
        <div class="header">
          <span>{{ title }}</span>
          <span @click="onCancel">
            <i class="iconfont iconic_close"/>
          </span>
        </div>
        <div class="modal-content">
          <Input
            v-model="text"
            type="textarea"
            :rows="5"
            :maxlength="120"
          />
          <span class="limit">
            {{ `${text.length}/120 字` }}
          </span>
        </div>
        <div class="modal-buttons">
          <Button
            v-if="showCancel"
            type="cancel"
            @click="onCancel"
          >
            取消
          </Button>
          <Button
            type="confirm"
            @click="onConfirm(text)"
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import {Input} from 'iview'
import Button from '../../../components/button'

export default {
  components: {
    Input,
    Button,
  },
  data() {
    return {
      visible: false,
      title: '',
      zIndex: 1000,
      text: '',
      showCancel: false,
      onCancel: false,
      onConfirm: false,
    }
  },
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
.ui-widget-modal {
  .modal-warp {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 498px;
    height: 276px;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }

  .modal-inner {
    background: #fff;
    box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    overflow: hidden;
  }

  .header {
    height: 60px;
    background-color: #eaf1ff;
    box-sizing: border-box;
    padding: 0 21px 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      &:nth-child(1) {
        color: #434a66;
        font-size: 18px;
        font-weight: 600;
      }

      &:nth-child(2) {
        font-size: 14px;
        color: rgb(149, 156, 178);
      }
    }
  }

  .modal-content {
    margin: 23px auto 20px 25px;
    width: 452px;
    height: 116px;
    font-size: 14px;
    font-weight: 400;
    color: #434a66;
    line-height: 20px;
    border-radius: 6px;
    position: relative;

    /deep/ .ivu-input {
      resize: none;
    }

    .limit {
      position: absolute;
      bottom: 4px;
      right: 10px;
      font-size: 12px;
    }
  }

  .modal-buttons {
    text-align: right;
    margin: 30px 0;
    margin-top: 0;
    padding-right: 22px;

    .ivu-btn {
      margin-left: 30px;
      height: 32px;
    }
  }
}
</style>