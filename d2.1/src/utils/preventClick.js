import Vue from 'vue'
import {Message} from 'element-ui';
const preventClick = Vue.directive('preventClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                    Message({ message: '您的操作太频繁了', type: "info" });
                }, binding.value || 3000)
            }
        })
    }
});

export default preventClick 