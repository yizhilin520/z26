<script type="text/javascript">
import {Page} from 'iview'

export default {
  mixins: [Page],
  props: {
    prevText: {
      type: String,
      default: '上一页'
    },
    nextText: {
      type: String,
      default: '下一页'
    },
    align: {
      type: String,
      default: 'right'
    }
  },
  render(createElement, context) {
    const {align} = this
    return createElement('div', {
      class: 'ui-widget-page',
      style: {textAlign: align}
    }, [Page.render.apply(this, [createElement, context])])
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  .ui-widget-page {
    margin: 40px 0;

    .ivu-page-prev, .ivu-page-next {
      width: 67px;
      height: 30px;
      border-radius: 6px 2px 6px 6px;
      border: 1px solid #E6EAF3;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      a {
        color: #434A66;
      }

      &.ivu-page-disabled {
        a {
          color: #949BB1;
        }
      }
    }

    .ivu-page-item {
      border-radius: 2px;

      a {
        color: #6D6F89;
      }

      &.ivu-page-item-active,&:hover {
        background-color: $textColor;
        border-color: $textColor;
        a {
          color: #fff;
        }
      }
    }
  }
</style>