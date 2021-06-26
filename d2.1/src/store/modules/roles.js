import { queryAllMenus } from "@/api/authority_api";

const getDefaultState = () => {
  return {
    allMenus: []
  };
};

const state = getDefaultState();

const mutations = {
  SET__ALL_MENUS: (state, allMenus) => {
    state.allMenus = allMenus;
  }
};

const actions = {
  // 所有菜单
  getAllMenus({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllMenus()
        .then(res => {
          if (res.code * 1 === 200) commit("SET__ALL_MENUS", res.data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
