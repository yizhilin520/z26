import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css";

import Element from "element-ui";


// 数据字典
// import dict from './components/Dict'

// 权限指令
import permission from "./components/Permission";
// import './assets/styles/element-variables.scss'
// global css
import "./assets/styles/index.scss";
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
// import './assets/css/theme-green/index.css' // 浅绿色主题

// 代码高亮
import VueHighlightJS from "vue-highlightjs";
import "highlight.js/styles/atom-one-dark.css";

import preventClick from './utils/preventClick' //防多次点击，重复提交
Vue.use(preventClick)

import App from "./App";
import store from "./store";
import router from "./router/routers";

import "./assets/icons"; // icon
import "./router/index"; // permission control

import "@/styles/index.scss";

Vue.prototype.$bus = new Vue()

Vue.use(VueHighlightJS);
Vue.use(permission);
// Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get("size") || "small" // set element-ui default size
});
require("promise.prototype.finally").shim();
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
