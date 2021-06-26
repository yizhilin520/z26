import { login, getInfo, logout, queryByUserId } from "@/api/login";
import {
  getToken,
  setToken,
  removeToken,
  setData,
  removeData
} from "@/utils/auth";

// const user = {
//   state: {
//     token: getToken(),
//     user: {},
//     roles: [],
//     // 第一次加载菜单时用到
//     loadMenus: false,
//     userInfo: {}
//   },
const getDefaultState = () => {
  return {
    token: getToken(),
    user: {},
    roles: [],
    menusList: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    userInfo: {},
    isLogin: false
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  SET_USER_INFO: (state, data) => {
    state.userInfo = data;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_MENUS_LIST: (state, menusList) => {
    state.menusList = menusList;
  },
  SET_LOAD_MENUS: (state, loadMenus) => {
    state.loadMenus = loadMenus;
  },
  SET_IS_LOGIN: (state, isLogin) => {
    state.isLogin = isLogin;
  }
};

const actions = {
  // 登录
  Login({ dispatch, commit }, userInfo) {
    const rememberMe = userInfo.account;
    return new Promise((resolve, reject) => {
      login({ ...userInfo })
        .then(res => {
          const { data } = res;
          if (data !== null) {
            setToken(data.token, rememberMe);
            commit("SET_TOKEN", data.token);
            commit("SET_USER_INFO", data);
            setData("userName", data.userName);
            // // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit("SET_LOAD_MENUS", true);
            commit("SET_IS_LOGIN", true);
            let permissionList = data.permissionList;
            dispatch("handleMenus", permissionList);
          }
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 加载当前登录用户的权限菜单列表
  LoadPermissionMenus({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      queryByUserId()
        .then(res => {
          if (res.data !== null && res.code * 1 == 200) {
            let permissionList = res.data;
            dispatch("handleMenus", permissionList);
          } else if (res.code * 1 === 401) {
            removeToken();
          } else if (res.code * 1 == 999) {
            reject(res.msg)
          }
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  async handleMenus({ commit }, data) {
    let arr = [];
    arr = await data.map(item => {
      let children = item.list.map(it => {
        return {
          id: it.id,
          sort: it.sort,
          type: it.type,
          permission: it.permission,
          name: it.name,
          path: it.name.replace(it.name[0], it.name[0].toLocaleLowerCase()), //字符串首字符转小写
          component: `${it.url.slice(1)}/index`,
          hidden: false,
          meta: it.meta
        };
      });
      let itemobj = {
        id: item.id,
        sort: item.sort,
        type: item.type,
        permission: item.permission,
        alwaysShow: true,
        component: "Layout",
        hidden: false,
        name: item.name,
        path: item.url,
        meta: item.meta,
        redirect: `${item.url}/${children[0].path}`
      };
      return {
        ...itemobj,
        children: children
      };
    });
    arr.unshift({
      path: "/",
      component: "Layout",
      redirect: arr[0].path
    });
    // console.log(arr, "0000000000000");
    if (state.roles.length === 0) commit("SET_ROLES", arr);
    if (state.menusList.length === 0) commit("SET_MENUS_LIST", arr);
  },

  // 获取用户信息
  // GetInfo({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo().then(res => {
  //       setUserInfo(res, commit)
  //       resolve(res)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  // 登出
  LogOut({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken(); // must remove  token  first
          commit("RESET_STATE", {});
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE", {});
      // removeData('userName')
      resolve();
    });
  },

  updateLoadMenus({ commit }) {
    return new Promise((resolve, reject) => {
      commit("SET_LOAD_MENUS", false);
    });
  }
};

// export const logOut = (commit) => {
//   commit('SET_TOKEN', '')
//   commit('SET_ROLES', [])
//   removeToken()
// }

// export const setUserInfo = (res, commit) => {
//   // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
//   if (res.roles.length === 0) {
//     commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
//   } else {
//     commit('SET_ROLES', res.roles)
//   }
//   commit('SET_USER', res.user)
// }

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
