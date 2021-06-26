<script type="text/javascript">
import {Button} from 'iview'

export default {
  mixins: [Button],
  props: {
    type: {
      validator: val => ['default', 'primary', 'confirm', 'cancel', 'dashed', 'text', 'info', 'success', 'warning', 'error'].indexOf(val) !== -1,
      default: 'default'
    },
    size: {
      validator: val => ['small', 'medium', 'large', 'default'].indexOf(val) !== -1,
      default() {
        return !this.$IVIEW || this.$IVIEW.size === '' ? 'medium' : this.$IVIEW.size
      }
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      const {plain} = this
      const classArr = Button.computed.classes.call(this).concat(['club'])
      if (plain) classArr.push('is-plain')
      return classArr
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
.ivu-btn.club {
  color: #080808;
  border-color: #d9d9d9;
  /*居中对齐下，因为UI设计的乱七八糟*/
  text-align: center;
  transition: none;
  border-radius: 6px 2px 6px 6px;
  box-shadow: none;

  &.ivu-btn-medium {
    padding: 5px 24px;
  }

  &.ivu-btn-large {
    padding: 10px 30px;
  }

  &.ivu-btn-default {
    font-size: 14px;
    color: $textColor;
    border: 1px solid $textColor;
    height: 32px;

  }

  &.ivu-btn-cancel {
    color: #666;
    border-color: #d9d9d9;
  }

  &.ivu-btn-text {
    color: $textColor;
    border: none;

    &:hover {
      color: $textColor;
      background: transparent;
      border-color: transparent;
    }

    &:before {
      content: none;
    }
  }

  &.ivu-btn-confirm {
    padding: 7px 25px;
    color: #fff;
    background: $buttonActiveBackground;
    border: none;

    &:hover {
      padding: 7px 25px;
    }

    &.is-plain {
      color: #693D12;
      background: transparent;
      border-color: #693D12;
      border-radius: 4px;
    }
  }

  & + .ivu-btn {
    margin-left: 8px;
  }

  &:hover {
    padding: 6px 25px;
    color: #fff;
    background: $buttonActiveBackground;
    border: none;
  }
}
</style>