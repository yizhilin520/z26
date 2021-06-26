import Vue from "vue";
import Router from "vue-router";
import Layout from "../layout/index";

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    meta: { title: "登录", noCache: true },
    component: resolve => require(["@/views/login"], resolve),
    hidden: true
  },
  {
    path: "/404",
    component: resolve => require(["@/views/features/404"], resolve),
    hidden: true
  },
  {
    path: "/401",
    component: resolve => require(["@/views/features/401"], resolve),
    hidden: true
  },
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: resolve => require(["@/views/features/redirect"], resolve)
      }
    ]
  },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "noredirect"
  //   // children: [
  //   //   {
  //   //     path: 'dashboard',
  //   //     component: (resolve) => require(['@/views/home'], resolve),
  //   //     name: 'Dashboard',
  //   //     meta: { title: '首页', icon: 'index', affix: true, noCache: true }
  //   //   }
  //   // ]
  // },
  // {
  //   path: "/homePage",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "首页管理", icon: "el-icon-s-home", noCache: true },
  //   name: "首页管理",
  //   redirect: "/homePage/classification",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/homePage/classification",
  //       component: resolve =>
  //         require(["@/views/homePage/classification"], resolve),
  //       name: "Classification",
  //       hidden: false,
  //       meta: { title: "分类管理", icon: "el-icon-document", noCache: true }
  //     },
  //     {
  //       path: "/homePage/recommend",
  //       component: resolve => require(["@/views/homePage/recommend"], resolve),
  //       name: "Recommend",
  //       hidden: false,
  //       meta: {
  //         title: "推荐管理",
  //         icon: "el-icon-star-on",
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/film",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "影片管理", icon: "el-icon-film", noCache: true },
  //   name: "影片管理",
  //   redirect: "/film/filmList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/film/filmList",
  //       component: resolve => require(["@/views/film/filmList"], resolve),
  //       name: "FilmList",
  //       hidden: false,
  //       meta: { title: "影片列表库", icon: "el-icon-s-grid", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/shortVideo",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "短视频管理", icon: "el-icon-video-camera", noCache: true },
  //   name: "短视频管理",
  //   redirect: "/shortVideo/videoList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/shortVideo/videoList",
  //       component: resolve =>
  //         require(["@/views/shortVideo/videoList"], resolve),
  //       name: "VideoList",
  //       hidden: false,
  //       meta: { title: "短视频列表", icon: "el-icon-s-grid", noCache: true }
  //     },
  //     {
  //       path: "/shortVideo/videoReview",
  //       component: resolve =>
  //         require(["@/views/shortVideo/videoReview"], resolve),
  //       name: "VideoReview",
  //       hidden: false,
  //       meta: { title: "短视频审核", icon: "el-icon-video-play", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/user",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "用户管理", icon: "el-icon-user", noCache: true },
  //   name: "用户管理",
  //   redirect: "/user/userList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/user/userList",
  //       component: resolve => require(["@/views/user/userList"], resolve),
  //       name: "UserList",
  //       hidden: false,
  //       meta: { title: "用户列表", icon: "el-icon-s-grid", noCache: true }
  //     },
  //     {
  //       path: "/user/abnormalUser",
  //       component: resolve => require(["@/views/user/abnormalUser"], resolve),
  //       name: "AbnormalUser",
  //       hidden: false,
  //       meta: {
  //         title: "异常用户",
  //         icon: "el-icon-warning-outline",
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/statistics",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "数据统计", icon: "el-icon-s-data", noCache: true },
  //   name: "数据统计",
  //   redirect: "/statistics/userStatistics",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/statistics/userStatistics",
  //       component: resolve =>
  //         require(["@/views/statistics/userStatistics"], resolve),
  //       name: "UserStatistics",
  //       hidden: false,
  //       meta: { title: "用户统计", icon: "el-icon-user", noCache: true }
  //     },
  //     {
  //       path: "/statistics/userTrend",
  //       component: resolve =>
  //         require(["@/views/statistics/userTrend"], resolve),
  //       name: "UserTrend",
  //       hidden: false,
  //       meta: { title: "用户留存统计", icon: "el-icon-s-check", noCache: true }
  //     },
  //     {
  //       path: "/statistics/channelUser",
  //       component: resolve =>
  //         require(["@/views/statistics/channelUser"], resolve),
  //       name: "ChannelUser",
  //       hidden: false,
  //       meta: {
  //         title: "渠道用户统计",
  //         icon: "el-icon-s-platform",
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: "/statistics/channelTrend",
  //       component: resolve =>
  //         require(["@/views/statistics/channelTrend"], resolve),
  //       name: "ChannelTrend",
  //       hidden: false,
  //       meta: {
  //         title: "渠道留存统计",
  //         icon: "el-icon-platform-eleme",
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: "/statistics/videoStatistics",
  //       component: resolve =>
  //         require(["@/views/statistics/videoStatistics"], resolve),
  //       name: "VideoStatistics",
  //       hidden: false,
  //       meta: { title: "播放统计", icon: "el-icon-video-play", noCache: true }
  //     },
  //     {
  //       path: "/statistics/videoLabel",
  //       component: resolve =>
  //         require(["@/views/statistics/videoLabel"], resolve),
  //       name: "VideoLabel",
  //       hidden: false,
  //       meta: {
  //         title: "视频标签统计",
  //         icon: "el-icon-collection-tag",
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: "/statistics/userUpload",
  //       component: resolve =>
  //         require(["@/views/statistics/userUpload"], resolve),
  //       name: "UserUpload",
  //       hidden: false,
  //       meta: { title: "用户上传统计", icon: "el-icon-upload", noCache: true }
  //     },
  //     {
  //       path: "/statistics/payUser",
  //       component: resolve => require(["@/views/statistics/payUser"], resolve),
  //       name: "PayUser",
  //       hidden: false,
  //       meta: { title: "付费用户统计", icon: "el-icon-coin", noCache: true }
  //     },
  //     {
  //       path: "/statistics/incomeAmount",
  //       component: resolve =>
  //         require(["@/views/statistics/incomeAmount"], resolve),
  //       name: "IncomeAmount",
  //       hidden: false,
  //       meta: { title: "收入金额统计", icon: "el-icon-money", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/channel",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "渠道管理", icon: "el-icon-monitor", noCache: true },
  //   name: "渠道管理",
  //   redirect: "/channel/channelList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/channel/channelList",
  //       component: resolve => require(["@/views/channel/channelList"], resolve),
  //       name: "ChannelList",
  //       hidden: false,
  //       meta: { title: "渠道列表", icon: "el-icon-s-grid", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/information",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "消息管理", icon: "el-icon-bell", noCache: true },
  //   name: "消息管理",
  //   redirect: "/information/messageManagement",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/information/messageManagement",
  //       component: resolve =>
  //         require(["@/views/information/messageManagement"], resolve),
  //       name: "MessageManagement",
  //       hidden: false,
  //       meta: { title: "消息列表", icon: "el-icon-s-grid", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/notice",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "公告管理", icon: "el-icon-data-analysis", noCache: true },
  //   name: "公告管理",
  //   redirect: "/notice/noticeList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/notice/noticeList",
  //       component: resolve => require(["@/views/notice/noticeList"], resolve),
  //       name: "NoticeList",
  //       hidden: false,
  //       meta: { title: "公告列表", icon: "el-icon-s-grid", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/version",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "版本管理", icon: "el-icon-mobile-phone", noCache: true },
  //   name: "版本管理",
  //   redirect: "/version/versionList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/version/versionList",
  //       component: resolve => require(["@/views/version/versionList"], resolve),
  //       name: "VersionList",
  //       hidden: false,
  //       meta: { title: "版本列表", icon: "el-icon-s-grid", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/advertising",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "广告管理", icon: "el-icon-goods", noCache: true },
  //   name: "广告管理",
  //   redirect: "/advertising/startPage",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/advertising/startPage",
  //       component: resolve =>
  //         require(["@/views/advertising/startPage"], resolve),
  //       name: "StartPage",
  //       hidden: false,
  //       meta: { title: "启动页广告", icon: "el-icon-eleme", noCache: true }
  //     },
  //     {
  //       path: "/advertising/shortVideo",
  //       component: resolve =>
  //         require(["@/views/advertising/shortVideo"], resolve),
  //       name: "ShortVideo",
  //       hidden: false,
  //       meta: {
  //         title: "短视频广告",
  //         icon: "el-icon-video-camera",
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: "/advertising/banner",
  //       component: resolve => require(["@/views/advertising/banner"], resolve),
  //       name: "Banner",
  //       hidden: false,
  //       meta: { title: "首页banner", icon: "el-icon-s-home", noCache: true }
  //     },
  //     {
  //       path: "/advertising/community",
  //       component: resolve =>
  //         require(["@/views/advertising/community"], resolve),
  //       name: "Community",
  //       hidden: false,
  //       meta: { title: "社区banner", icon: "el-icon-guide", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/task",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "任务管理", icon: "el-icon-office-building", noCache: true },
  //   name: "任务管理",
  //   redirect: "/task/signTask",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/task/signTask",
  //       component: resolve => require(["@/views/task/signTask"], resolve),
  //       name: "SignTask",
  //       hidden: false,
  //       meta: { title: "签到任务", icon: "el-icon-date", noCache: true }
  //     },
  //     {
  //       path: "/task/inviteTask",
  //       component: resolve => require(["@/views/task/inviteTask"], resolve),
  //       name: "InviteTask",
  //       hidden: false,
  //       meta: { title: "邀请任务", icon: "el-icon-wind-power", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/member",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "会员管理", icon: "el-icon-user-solid", noCache: true },
  //   name: "会员管理",
  //   redirect: "/member/package",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/member/package",
  //       component: resolve => require(["@/views/member/package"], resolve),
  //       name: "Package",
  //       hidden: false,
  //       meta: { title: "VIP套餐管理", icon: "el-icon-s-order", noCache: true }
  //     },
  //     {
  //       path: "/member/equity",
  //       component: resolve => require(["@/views/member/equity"], resolve),
  //       name: "Equity",
  //       hidden: false,
  //       meta: { title: "VIP权益管理", icon: "el-icon-goods", noCache: true }
  //     },
  //     {
  //       path: "/member/usertime",
  //       component: resolve => require(["@/views/member/usertime"], resolve),
  //       name: "Usertime",
  //       hidden: false,
  //       meta: {
  //         title: "会员用户时长",
  //         icon: "el-icon-s-opportunity",
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/post",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "帖子管理", icon: "el-icon-edit-outline", noCache: true },
  //   name: "帖子管理",
  //   redirect: "/post/postList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/post/postList",
  //       component: resolve => require(["@/views/post/postList"], resolve),
  //       name: "PostList",
  //       hidden: false,
  //       meta: { title: "帖子列表", icon: "el-icon-s-data", noCache: true }
  //     },
  //     {
  //       path: "/post/postReview",
  //       component: resolve => require(["@/views/post/postReview"], resolve),
  //       name: "PostReview",
  //       hidden: false,
  //       meta: { title: "帖子审核", icon: "el-icon-edit", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/recharge",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "在线充值", icon: "el-icon-bank-card", noCache: true },
  //   name: "在线充值",
  //   redirect: "/recharge/user",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/recharge/user",
  //       component: resolve => require(["@/views/recharge/user"], resolve),
  //       name: "User",
  //       hidden: false,
  //       meta: { title: "用户充值", icon: "el-icon-money", noCache: true }
  //     },
  //     {
  //       path: "/recharge/order",
  //       component: resolve => require(["@/views/recharge/order"], resolve),
  //       name: "Order",
  //       hidden: false,
  //       meta: { title: "充值订单", icon: "el-icon-s-order", noCache: true }
  //     },
  //     {
  //       path: "/recharge/customerService",
  //       component: resolve =>
  //         require(["@/views/recharge/customerService"], resolve),
  //       name: "CustomerService",
  //       hidden: false,
  //       meta: { title: "充值客服QQ", icon: "el-icon-s-custom", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/account",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "账户管理", icon: "el-icon-wallet", noCache: true },
  //   name: "账户管理",
  //   redirect: "/account/userDetail",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/account/userDetail",
  //       component: resolve => require(["@/views/account/userDetail"], resolve),
  //       name: "UserDetail",
  //       hidden: false,
  //       meta: { title: "用户交易明细", icon: "el-icon-tickets", noCache: true }
  //     },
  //     {
  //       path: "/account/transStatistics",
  //       component: resolve =>
  //         require(["@/views/account/transStatistics"], resolve),
  //       name: "TransStatistics",
  //       hidden: false,
  //       meta: { title: "用户交易统计", icon: "el-icon-s-data", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/feedback",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "意见反馈", icon: "el-icon-position", noCache: true },
  //   name: "意见反馈",
  //   redirect: "/feedback/feedbackList",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/feedback/feedbackList",
  //       component: resolve =>
  //         require(["@/views/feedback/feedbackList"], resolve),
  //       name: "FeedbackList",
  //       hidden: false,
  //       meta: {
  //         title: "意见列表",
  //         icon: "el-icon-chat-dot-square",
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/label",
  //   component: Layout,
  //   hidden: false,
  //   name: "标签管理",
  //   meta: {
  //     title: "标签管理",
  //     icon: "el-icon-collection-tag",
  //     noCache: true
  //   },
  //   alwaysShow: true,
  //   redirect: "/label/labelList",
  //   children: [
  //     {
  //       path: "/label/labelList",
  //       component: () => import("@/views/label/labelList"),
  //       name: "LabelList",
  //       meta: {
  //         title: "标签列表",
  //         icon: "el-icon-s-data"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/authority",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "权限管理", icon: "el-icon-s-tools", noCache: true },
  //   name: "权限管理",
  //   redirect: "/authority/roles",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/authority/roles",
  //       component: resolve => require(["@/views/authority/roles"], resolve),
  //       name: "Roles",
  //       hidden: false,
  //       meta: { title: "角色管理", icon: "el-icon-view", noCache: true }
  //     },
  //     {
  //       path: "/authority/member",
  //       component: resolve => require(["@/views/authority/member"], resolve),
  //       name: "Member",
  //       hidden: false,
  //       meta: { title: "成员管理", icon: "el-icon-user", noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/otherSetting",
  //   component: Layout,
  //   hidden: false,
  //   meta: { title: "其他设置", icon: "el-icon-s-operation", noCache: true },
  //   name: "其他设置",
  //   redirect: "/otherSetting/account",
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: "/otherSetting/account",
  //       component: resolve =>
  //         require(["@/views/otherSetting/account"], resolve),
  //       name: "Account",
  //       hidden: false,
  //       meta: { title: "官方账号设置", icon: "el-icon-s-check", noCache: true }
  //     },
  //     {
  //       path: "/otherSetting/sensitive",
  //       component: resolve =>
  //         require(["@/views/otherSetting/sensitive"], resolve),
  //       name: "Sensitive",
  //       hidden: false,
  //       meta: { title: "敏感词设置", icon: "el-icon-scissors", noCache: true }
  //     },
  //     {
  //       path: "/otherSetting/avatar",
  //       component: resolve =>
  //         require(["@/views/otherSetting/avatar"], resolve),
  //       name: "Avatar",
  //       hidden: false,
  //       meta: { title: "系统头像设置", icon: "el-icon-user", noCache: true }
  //     }
  //   ]
  // }
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'center',
  //       component: (resolve) => require(['@/views/system/user/center'], resolve),
  //       name: '个人中心',
  //       meta: { title: '个人中心' }
  //     }
  //   ]
  // }
];

export default new Router({
  mode: "hash",
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
