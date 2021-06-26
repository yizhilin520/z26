const getDefaultState = () => {
  return {
    channelList: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_CHANNEL_LIST(state, data) {
    state.channelList = [...data];
  }
};

const actions = {
  setChanelList({commit}, data) {
    commit('SET_CHANNEL_LIST', data)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
