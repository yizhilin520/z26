import router from "./routers";
import store from "@/store";
import Config from "@/settings";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // getToken from cookie
import { filterAsyncRouter } from "@/store/modules/permission";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.title) {
    document.title = "抖动后台管理系统";
  }

  NProgress.start();
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (store.getters.menusList.length == 0) {
        store
          .dispatch("user/LoadPermissionMenus")
          .then(() => {
            loadMenus(next, to);
          })
          .catch(() => {
            // store.dispatch("user/LogOut").then(() => {
            //   location.reload(); // 为了重新实例化vue-router对象 避免bug
            // });
          });
        // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch("user/updateLoadMenus", false);
        loadMenus(next, to);
      } else {
        next();
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

export const loadMenus = (next, to) => {
  let params =
    store.getters.roles.length > 0
      ? store.getters.roles
      : store.getters.menusList;
  const asyncRouter = filterAsyncRouter(params);
  asyncRouter.push({ path: "*", redirect: "/404", hidden: true });
  store.dispatch("GenerateRoutes", asyncRouter).then(() => {
    // 存储路由
    router.addRoutes(asyncRouter); // 动态添加可访问路由表
    next({ ...to, replace: true });
  });
};

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
