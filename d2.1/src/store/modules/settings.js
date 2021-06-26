import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
const { tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings

const getDefaultState = () => {
  return {
    theme: variables.theme,
    showSettings: false,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    uniqueOpened: uniqueOpened,
    showFooter: showFooter,
    footerTxt: footerTxt,
    caseNumber: caseNumber,
    tabkey: 1,
    madouRoutes: [],
    doudongRoutes: []
  }
}

const state = getDefaultState

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CHANGE_TABS: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CLONE_DOUDONG: (state, data) => {
    state.doudongRoutes = [...data]
  },
  CLONE_MADOU: (state, data) => {
    state.madouRoutes = [...data]
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  changeTabs({commit}, data) {
    commit('CHANGE_TABS', data)
  },
  cloneDoudongRoutes({commit}, data) {
    commit('CLONE_DOUDONG',data)
  },
  cloneMadouRoutes({commit}, data) {
    commit('CLONE_MADOU',data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

