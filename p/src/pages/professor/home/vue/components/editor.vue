<template>
  <div
    class="ui-widget-editor"
  >
    <div
      class="editor-menu"
      :class="[toolbarClass,{disabled}]"
      :style="{zIndex: defaultConfig.zIndex + 1}"
    >
      <div
        ref="menu"
        class="menu-inner"
      />
    </div>
    <slot name="middle"/>
    <div
      class="editor-main"
      :class="[warpClass,{disabled}]"
      :style="{height}"
    >
      <p
        v-show="showPlaceholder"
        class="editor-placeholder"
        v-text="placeholder"
      />
      <div
        ref="main"
        class="text-content pro-iview"
        @compositionstart="inputMethodIsTyping = true"
        @compositionend="inputMethodIsTyping = false"
        @input="__onInput"
      />
    </div>
    <Spin
      v-if="editorLoading"
      size="large"
      fix
    />
  </div>
</template>
<script type="text/javascript">
import {Spin} from 'iview'

export default {
  components: {
    Spin
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    loading: Boolean,
    height: {
      type: String,
      default: '500px'
    },
    warpClass: {
      type: String,
      default: null
    },
    toolbarClass: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      instance: null,
      componentLoading: false,
      //是否禁用
      disabled: false,
      // 编辑器内容是否为空
      isHtmlEmpty: true,
      // 输入法是否正在输入
      inputMethodIsTyping: false
    }
  },
  computed: {
    // loading效果
    editorLoading() {
      const {loading, componentLoading} = this
      return loading || componentLoading
    },
    // 编辑器默认设置
    defaultConfig() {
      const that = this
      const {
        config: {uploadFileName: configFileName},
        instance,
        __onChange,
      } = that

      const uploadFileName = configFileName || 'file'

      return {
        uploadFileName,
        zIndex: 1000,
        //隐藏“网络图片”tab
        showLinkImg: false,
        // 忽略粘贴内容中的图片
        pasteIgnoreImg: false,
        // 过滤粘贴的样式
        pasteFilterStyle: true,
        linkCheck(text, link) {
          const flag = (/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i).test(link)
          if (!flag) return '链接地址不正确'

          return true
        },
        menus: [
          // 'head',  // 标题
          // 'bold',  // 粗体
          // 'fontSize',  // 字号
          // 'fontName',  // 字体
          // 'italic',  // 斜体
          // 'underline',  // 下划线
          // 'strikeThrough',  // 删除线
          // 'foreColor',  // 文字颜色
          // 'backColor',  // 背景颜色
          // 'link',  // 插入链接
          // 'list',  // 列表
          // 'justify',  // 对齐方式
          // 'quote',  // 引用
          // 'emoticon',  // 表情
          'image',  // 插入图片
          // 'table',  // 表格
          // 'video',  // 插入视频
          // 'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ],
        onfocus: () => {
          that.$emit('focus', instance, that)
        },
        onblur: () => {
          that.$emit('blur', instance, that)
        },
        onchange: __onChange
      }
    },
    // 是否显示placeholder
    showPlaceholder() {
      const {placeholder, isHtmlEmpty, inputMethodIsTyping} = this

      return placeholder && isHtmlEmpty && !inputMethodIsTyping
    }
  },
  watch: {
    disabled(disabled) {
      const {instance} = this
      if (!instance) return false
      instance.$textElem.attr('contenteditable', !disabled)
    }
  },
  beforeMount() {
    const {$nextTick, __init} = this
    $nextTick(__init)
  },
  beforeDestroy() {
    this.instance = null
  },
  methods: {
    // 初始化
    async __init() {
      const {
        $refs, config, defaultConfig, htmlFilter, isEmpty
      } = this
      this.componentLoading = true
      let WangEditor = await import(/* webpackChunkName: "editor" */'wangeditor')
      WangEditor = WangEditor.default ? WangEditor.default : WangEditor

      const instance = new WangEditor($refs.menu, $refs.main)
      // 不使用 styleWithCSS
      instance._useStyleWithCSS = true
      this.instance = instance

      this.$emit('ready', instance)

      instance.customConfig = {
        ...defaultConfig,
        ...config,
        pasteTextHandle: html => {
          this.$emit('paste', html, instance, this)
          if (config.pasteTextHandle) return config.pasteTextHandle(html)
          return htmlFilter(html)
        }
      }

      instance.create()

      this.componentLoading = false
    },
    replaceHtmlSymbol(html) {
      if (html == null) return ''

      return html.replace(/</gm, '&lt;')
        .replace(/>/gm, '&gt;')
        .replace(/"/gm, '&quot;')
        .replace(/(\r\n|\r|\n)/g, '')
        .replace(/(^\s+)|(\s+$)/g, '')
    },
    // 格式化编辑器中的内容
    htmlFilter(html) {
      const {instance} = this
      const {config = {}} = instance || {}
      // 将粘贴过来的数据的第一个节点全部换成p标签
      // 如果里边有img也就是图片用p标签包裹住
      // 先将图片这个标签替换成@@@路径@@@格式，这样在获取文本的时候直接替换就好了
      const imgFlag = '@@@'
      // 图片前缀，用于标记是否是图片
      const imgPrefix = `imageSrc${Date.now()}=`
      const {getNodes, replaceHtmlSymbol} = this

      html = html.replace(/<img[^>]* src=['"]([^'"]+)[^>]*>/gi, (match, url) => {
        // 如果是本地的图片就忽略
        if (!url || /^file:/.test(url) || !(config.menus || []).includes('image')) return ''

        return `${imgFlag}${imgPrefix}${url}${imgFlag}`
      })
      let nodesList = getNodes(html)

      if (nodesList.length === 1 && nodesList[0].childNodes.length) {
        // 验证是否只有一个标签里边包含很多标签这种
        nodesList = nodesList[0].childNodes
      }

      const filterHandler = htmlList => {
        const resultArr = []
        const insertTag = 'p'

        // 遍历节点直接获取文本
        for (let i = 0, length = htmlList.length; i < length; i += 1) {
          const curElem = htmlList[i]
          const nodeType = curElem.nodeType
          const nodeName = curElem.nodeName

          let text = ''
          if (nodeType === 3) {
            // 文本节点
            text = curElem.textContent
          } else if (nodeType === 1) {
            // 忽略某些标签不粘贴
            if (nodeName === 'META'
              || nodeName === 'LINK'
              || nodeName === 'SCRIPT'
              || nodeName === 'STYLE') {
              // eslint-disable-next-line
              continue
            }
            // 普通 DOM 节点
            text = curElem.innerText
          }

          // 去掉特殊字符以及转成数组
          const textStrArr = replaceHtmlSymbol(text)
            .split(imgFlag)

          if (textStrArr.length) {
            for (let j = 0, subLength = textStrArr.length; j < subLength; j += 1) {
              const imageReg = new RegExp(`^${imgPrefix}`)
              const currentText = textStrArr[j]
              let textDomStr = ''

              if (imageReg.test(currentText)) {
                // 是图片
                const imageSrc = currentText.replace(imgPrefix, '')
                textDomStr = `<img src="${imageSrc}">`
              } else {
                textDomStr = currentText
              }

              if (textDomStr) resultArr.push(`<${insertTag}>${textDomStr}</${insertTag}>`)
            }
          }
        }

        return resultArr.join('')
      }

      return filterHandler(nodesList)
    },
    __onInput() {
      const {placeholder, isEmpty} = this
      if (placeholder) this.isHtmlEmpty = isEmpty()
    },
    __onChange(htmlStr) {
      const {isEmpty, instance} = this
      const flag = isEmpty()

      this.isHtmlEmpty = flag
      this.$emit('change', flag ? '' : htmlStr, instance, this)
    },
    // 判断是否为空
    isEmpty() {
      const {getText, getHtml} = this
      const text = getText()
      const html = getHtml()

      const has = text || /<img /gi.test(html)

      return !has
    },
    // 设置内容
    setHtml(html) {
      const {instance, __onChange} = this
      if (!instance) return false

      instance.txt.html(html)
      __onChange(html)
      return this
    },
    // 追加内容
    appendHtml(html) {
      const {instance, __onChange, getHtml} = this
      if (!instance) return false
      instance.txt.append(html)
      __onChange(getHtml())
      return this
    },
    // 插入html
    insertHtml(html) {
      const {instance, __onChange, getHtml} = this
      if (!instance) return false
      instance.cmd.do('insertHTML', html)
      __onChange(getHtml())
      return this
    },
    // 清空内容
    clear() {
      const {instance, __onChange} = this
      if (!instance) return false
      instance.txt.clear()
      __onChange('')
      return this
    },
    // 获取html
    getHtml() {
      const {instance} = this
      if (!instance) return false
      return instance.txt.html()
    },
    // 获取text
    getText() {
      const {instance} = this
      if (!instance) return false
      return instance.txt.text()
    },
    // 获取json
    getJSON() {
      const {instance} = this
      if (!instance) return false
      return instance.txt.getJSON()
    },
    // 设置是否禁用编辑器,默认禁用
    setDisabled(disabled = true) {
      this.disabled = disabled
      return this
    },
    // 获取dom文档
    getNodes(html) {
      const dom = document.createElement('div')
      dom.innerHTML = html || this.getHtml()
      return dom.childNodes
    }
  }
}
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
@import '../style/iview';

.ui-widget-editor {
  position: relative;
  z-index: 20;

  .editor-menu {
    .menu-inner {
      padding: 0;
      height: 100%;
      align-items: center;

      /deep/ .w-e-menu {
        padding: 5px 8px;

        &:hover {
          .w-e-icon-image, .w-e-icon-undo, .w-e-icon-redo {
            background-position-x: -20px;
          }
        }

        i {
          display: block;
          width: 20px;
          height: 20px;
          line-height: 20px;

          &.w-e-icon-image, &.w-e-icon-undo, &.w-e-icon-redo {
            background-image: url("../images/editor-menu.png");
            background-repeat: no-repeat;
            background-size: 40px auto;
            background-position-x: 0;

            &:before {
              content: '';
            }
          }

          &.w-e-icon-image {
            background-position-y: 0;
          }

          &.w-e-icon-undo {
            background-position-y: -20px;
          }

          &.w-e-icon-redo {
            background-position-y: -40px;
          }
        }
      }
    }
  }

  .editor-main {
    position: relative;

    .editor-placeholder {
      color: #C2C9DC;
      line-height: inherit;
    }

    /deep/ .text-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      * {
        padding: 0;
        margin: 0;
      }

      p {
        line-height: inherit;
      }

      img {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>