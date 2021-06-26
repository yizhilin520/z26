/**
 * @intro: index.
 */
import Vue from 'vue'
import {Modal} from 'iview'
import Src from './component'

const Template = Vue.extend(Src)
let instance

const argsHandler = options => {
  if (typeof options === 'string') options = {text: options}
  return options
}

const ModalInstance = (options) => {
  options = argsHandler(options)
  if (!instance) {
    instance = new Template({
      el: document.createElement('div')
    })
  }


  Vue.nextTick(() => {
    const {text, title = '提示', showCancel = false, onCancel, onConfirm} = options || {}
    instance.text = text
    instance.title = title
    instance.showCancel = showCancel
    instance.onCancel = () => {
      ModalInstance.close()
      if (onCancel) onCancel()
    }
    instance.onConfirm = function(text) {
      ModalInstance.close()
      if (onConfirm) onConfirm(text)
    }
    // 调用组件中的方法获取zIndex
    instance.zIndex = Modal.methods.handleGetModalIndex() + 1000

    instance.visible = true
    instance.onClose = ModalInstance.close
  })

  document.body.appendChild(instance.$el)

  return ModalInstance
}

ModalInstance.edit = options => {
  options = argsHandler(options)
  options.showCancel = true
  return ModalInstance(options)
}

// ModalInstance.alert = options => {
//   options = argsHandler(options)
//   options.showCancel = false
//   return ModalInstance(options)
// }

ModalInstance.close = () => {
  if (!instance) return false
  instance.visible = false
}

export default ModalInstance