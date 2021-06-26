<template>
  <div v-if="userInfo" class="userdetails-container">
    <el-card shadow="never">
      <h3>基本信息</h3>
      <el-row class="top-table">
        <el-col :span="5" :style="{ textAlign: 'center' }">
          <div class="m_avatar">
            <i
              class="el-icon-edit-outline img_icon"
              @click="hanldeEditInfo('上传头像', 'headImage')"
            ></i>
            <el-avatar class="img" :size="60" :src="userInfo.headImage">
              <img src="@/assets/images/avatar.png" />
            </el-avatar>
            <div style="padding: 8px">
              <div>{{ userInfo.nickname }}</div>
              <div class="member">
                {{ viplevel }}
              </div>
              <div class="date">{{ vipDate }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <table border="1" style="width: 100%; border-collapse: collapse">
            <tr>
              <th class="th_tab" align="center">
                <div>ID</div>
              </th>
              <td class="th_tab" align="center">
                <div>{{ userInfo.id }}</div>
              </td>
              <th class="th_tab" align="center">
                <div>用户名</div>
              </th>
              <td class="th_tab" align="center">
                <div>{{ userInfo.account }}</div>
              </td>
            </tr>
            <tr>
              <th class="th_tab" align="center">
                <div>昵称</div>
              </th>
              <td class="th_tab" align="center">
                <div class="cus_box">
                  <i
                    class="el-icon-edit-outline img_icon"
                    @click="hanldeEditInfo('修改昵称', 'nickname')"
                  ></i>
                  <div class="cus_text">{{ userInfo.nickname }}</div>
                </div>
              </td>
              <th class="th_tab" align="center">
                <div>手机号码</div>
              </th>
              <td class="th_tab" align="center">
                <div class="cus_box">
                  <div class="cus_text">
                    {{
                      userInfo.phone === ""
                        ? ""
                        : userInfo.phone.slice(0, 3) +
                          "****" +
                          userInfo.phone.slice(7, 11)
                    }}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th class="th_tab" align="center">
                <div>性别</div>
              </th>
              <td class="th_tab" align="center">
                <div class="cus_box">
                  <i
                    class="el-icon-edit-outline img_icon"
                    @click="hanldeEditInfo('修改性别', 'sex')"
                  ></i>
                  <div class="cus_text">
                    {{ sexs.find((item) => userInfo.sex === item.value).label }}
                  </div>
                </div>
              </td>
              <th class="th_tab" align="center">
                <div>生日</div>
              </th>
              <td class="th_tab" align="center">
                <div class="cus_box">
                  <i
                    class="el-icon-edit-outline img_icon"
                    @click="hanldeEditInfo('修改生日', 'birthday')"
                  ></i>
                  <div class="cus_text">{{ userInfo.birthday }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <th class="th_tab" align="center">
                <div>注册时间</div>
              </th>
              <td class="th_tab" align="center">
                <div>{{ userInfo.createTime }}</div>
              </td>
              <th class="th_tab" align="center">
                <div>所在地</div>
              </th>
              <td class="th_tab" align="center">
                <div>{{ userInfo.area }}</div>
              </td>
            </tr>
          </table>
        </el-col>
      </el-row>

      <!-- 修改密码 -->
      <!-- <h3 class="h_title">密码</h3>
      <div class="password_content">
        <el-input
          show-password
          readonly
          value="11111111111"
          :style="{ width: '300px' }"
        />
        <el-button
          type="primary"
          size="small"
          @click="hanldeEditInfo('修改密码', 'password')"
          >重置</el-button
        >
      </div> -->

      <!-- 账户信息 -->
      <h3 class="h_title">账户信息</h3>
      <el-table
        :data="[userInfo]"
        :header-cell-style="{ background: '#f5f7fa' }"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column label="当前抖币" align="center" prop="goldNumber" />
        <el-table-column label="累计充值" align="center" prop="sumRecharge" />
        <el-table-column label="钱包余额" align="center" prop="balance" />
        <el-table-column label="转账总额" align="center" prop="sumTransfer" />
      </el-table>

      <!-- 统计信息 -->
      <h3 class="h_title">统计信息</h3>
      <el-table
        :data="[userInfo]"
        :header-cell-style="{ background: '#f5f7fa' }"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column label="邀请好友" align="center" prop="friendNum" />
        <el-table-column label="关注" align="center" prop="focusNum" />
        <el-table-column label="粉丝" align="center" prop="fansNum" />
        <el-table-column label="上传视频" align="center" prop="uploadNum" />
        <el-table-column label="收藏视频" align="center" prop="praiseNum" />
        <el-table-column
          label="视频获赞"
          align="center"
          prop="videoPraiseNum"
        />
        <el-table-column label="发帖数" align="center" prop="postNum" />
      </el-table>

      <h3>权限开关</h3>
      <el-table
        :header-cell-style="{ background: '#f5f7fa' }"
        border
        :data="permissionList"
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column align="center" prop="roleTitle" label="权限">
        </el-table-column>
        <el-table-column align="center" label="内容" prop="context" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.valided"
              inactive-color="#ccc"
              active-color="#13ce66"
              @change="handleSwitch(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <h3>上传记录</h3>
      <el-table
        :header-cell-style="{ background: '#f5f7fa' }"
        border
        fit
        :data="list"
        highlight-current-row
        size="mini"
      >
        <el-table-column align="center" label="视频ID">
          <template slot-scope="scope">{{ scope.row.videoId }}</template>
        </el-table-column>
        <el-table-column align="center" width="100" label="视频">
          <template slot-scope="scope">
            <el-image
              class="tb_image"
              :src="scope.row.videoImg"
              fit="cover"
              @click="checkplayFilm(scope.row.videoIdcUrl)"
            >
              <div slot="placeholder" class="tb_image_pl">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="tb_image_pl">
                <img
                  @click="checkplayFilm(scope.row.videoIdcUrl)"
                  class="tb_img"
                  src="@/assets/images/d_avatar@2x.png"
                  alt="图片加载失败"
                />
              </div>
            </el-image>
            <div
              class="play_icon"
              @click="checkplayFilm(scope.row.videoIdcUrl)"
            >
              <i class="el-icon-video-play" style="font-size: 30px"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="视频名称" align="center">
          <template slot-scope="scope">{{ scope.row.videoTitle }}</template>
        </el-table-column>
        <el-table-column label="发布日期" align="center">
          <template slot-scope="scope">{{ scope.row.publishTime }}</template>
        </el-table-column>
        <el-table-column label="大小" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.videoSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="播放数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.playNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收藏数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.praiseNum }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delVideo(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <slot name="pagination"></slot>
    </el-card>

    <!-- 查看视频 -->
    <el-dialog
      center
      class="my_play_video my-dialog"
      title="播放视频"
      :visible.sync="isPlay"
      width="900px"
      :before-close="handleCancel"
      :modal-append-to-body="false"
    >
      <div class="play_video" style="text-align: center">
        <video
          id="container"
          class="video-js vjs-big-play-centered"
          controls
          :src="url"
          preload="auto"
          webkit-playsinline="true"
          playsinline="true"
        ></video>
      </div>
    </el-dialog>
    <edit-info-dialog :show="isInfo" :uInfo="uInfo" ref="userInfo" />
  </div>
</template>

<script>
import { changeSwitch } from "@/api/user_api";
import EditInfoDialog from "./editInfoDialog.vue";
export default {
  name: "UserDetail",
  components: { "edit-info-dialog": EditInfoDialog },
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    pages: {
      type: Object,
      default: null,
    },
    list: {
      type: Array,
      default: [],
    },
    permissionList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      userTypeOptions: [
        {
          value: -1,
          label: "全部",
        },
        { value: 0, label: "普通用户" },
        { value: 1, label: "会员用户" },
        { value: 2, label: "封禁用户" },
      ],
      vipLevelData: {
        0: "普通用户",
        1: "黄金会员",
        2: "白金会员",
        3: "砖石会员",
        4: "永久会员",
      },
      sexs: [
        {
          value: 0,
          label: "男",
        },
        {
          value: 1,
          label: "女",
        },
        {
          value: 2,
          label: "保密",
        },
      ],
      isPlay: false,
      url: "",
      isInfo: false,
      uInfo: {
        title: "",
        userText: "",
        type: "",
      },
    };
  },
  computed: {
    viplevel() {
      return this.vipLevelData[this.userInfo.vipLevel * 1];
    },
    vipDate() {
      return this.userInfo.vipLevel * 1 !== 0
        ? `${this.userInfo.vipStartTime} 至 ${this.userInfo.vipEndTime}`
        : "";
    },
  },
  created() {},
  methods: {
    // 修改基本信息
    hanldeEditInfo(title, type, userText) {
      this.isInfo = true;
      this.uInfo = {
        title,
        userText,
        type,
      };
      this.$refs["userInfo"].headImage = this.userInfo.headImage;
      this.$refs["userInfo"].userParams = {
        id: this.userInfo.id,
        sex: this.userInfo.sex,
        birthday: this.userInfo.birthday,
        nickname: this.userInfo.nickname,
      };
    },
    // 开关/
    handleSwitch(row) {
      changeSwitch({ roleId: row.id, isValid: row.valided })
        .then((res) => {
          if (Number(res.code) === 200) {
            this.$parent.fetchPermissionList();
          }
        })
        .catch(() => {});
    },
    // 查看视频
    checkplayFilm(item) {
      this.isPlay = true;
      this.url = item;
    },
    //取消弹窗
    handleCancel() {
      let myVideo = document.getElementById("container");
      myVideo.currentTime = 0;
      myVideo.pause();
      this.isPlay = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.tr_all {
  height: 36px;
  width: 400px;
}
.th_table {
  vertical-align: middle;
  background: rgb(245, 247, 250);
}
.th_tab {
  vertical-align: middle;
  height: 48px;
}
.userdetails-container {
  min-height: 50%;
  max-height: 50%;
  .box-card {
    min-width: 100%;
    margin-bottom: 50px;
  }
  .cov {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    position: absolute;
    text-align: center;
    font-size: 16px;
    box-shadow: 0px 0px 5px black;
  }
  .con {
    z-index: 1100;
    width: 600px;
    height: 200px;
    background-color: white;
    position: fixed;
    right: 30%;
    top: 30%;
    position: fixed;
    box-shadow: 0px 0px 15px black;
  }
  .ptitle {
    width: 100%;
    height: 35px;
    background-color: #3daae9;
    color: white;
    line-height: 35px;
  }
  .dbt {
    border-radius: 5px;
    width: 70px;
    height: 30px;
    background-color: #3daae9;
    right: 20px;
    bottom: 20px;
    position: absolute;
    line-height: 30px;
    color: white;
  }
}
.top-table {
  .el-table__body-wrapper {
    overflow: hidden;
    position: relative;
    display: none;
  }
  .cell {
    padding: 4px 0;
  }
  .is-right {
    background: rgb(249, 249, 249);
  }

  .has-gutter {
    margin-top: -1px;
  }
  .el-table + .el-table {
    margin-top: -1px;
  }
}
.member {
  background: #ffa94c;
  margin: 10px auto;
  border-radius: 10px;
  width: 100px;
  height: 30px;
  line-height: 30px;
  color: #fff;
}
.img_icon {
  position: absolute;
  right: 1vw;
  top: 1.5vh;
  font-size: 16px;
  cursor: pointer;
}
.m_avatar {
  background: rgb(249, 249, 249);
  height: 200px;
  text-align: center;
  position: relative;

  .img {
    width: 50px;
    height: 50px;
    margin-top: 35px;
  }
  .date {
    font-size: 12px;
  }
}
.h_title {
  margin-top: 20px;
}
.play_video {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #3fdd86;
  width: 850px;
  height: 478px;
}
#container {
  width: 100%;
  height: 100%;
}
.cus_box {
  width: 100%;
  height: 100%;
  position: relative;
}
.cus_text {
  height: 100%;
  line-height: 3;
}
@import "@/assets/styles/style.scss";
</style>
