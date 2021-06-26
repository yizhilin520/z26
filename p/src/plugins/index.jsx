import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarProvider, useSnackbar as useNotistackSnackbar } from 'notistack';
import Grow from '@material-ui/core/Grow';
import { UseRequestProvider } from 'ahooks';
import { useLogin, useRequest, useWebsocketPush } from '@/utils/hooks';
import { getUserInfo, getWebConfig } from '@/servers/userServer';
import { UPDATE_LOGIN_REDUCER } from '@/actions/userAtion';
import { HttpCode } from '@/enums';
import useConfigActions from '@/actions/config';
import UpgradeDialog from '@/components/UpgradeDialog';

// 全局请求配置
const GlobalRequestOptions = {
  formatResult: (rData) => {
    const rD = (rData || {}).data || {};
    const { code, data } = rD;
    if (HttpCode.SUCCESS === code) return data;
    return throw { ...rD, type: 'business' };
  },
  throwOnError: true,
  defaultLoading: true
};

export const Provider = ({ children }) => {
  const dispatch = useDispatch();
  const configDispatch = useConfigActions();
  const userInfo = useSelector(({ user }) => user.userInfo || {});
  const { uid } = userInfo;
  const { isLogin, logout, login } = useLogin();
  const upgradeRef = useRef();

  useWebsocketPush('/sys', (d) => {
    const rD = d || {};
    const { optType, userId } = rD;
    const optTypeReg = new RegExp(`^${optType}$`);
    if (uid === userId) {
      if (isLogin && optTypeReg.test('3')) {
        // 封号
        // {
        //   optType: "3"
        //   remark: "用户封号"
        //   userId: "1342809520757350402"
        // }
        logout();
        login();
      }
      if (optTypeReg.test('10')) {
        // 升级
        // {currentLevel=10, optType=10, levelPrivileges=[
        // {iconUrl=xxx, code=change_card, content=改名卡, secondContent=Lv5解锁, level=5, status=1}
        // ],
        // type=10,
        // userId=1395625250400845825
        // }
        upgradeRef.current.open(rD);
      }
    }
  });

  // 更新用户信息
  useRequest(
    (q) => getUserInfo(q).toPromise(),
    null,
    (d) => {
      const { applyFlag, headImage, mobilePhone, nickname, roomId, sex, identityType, levelId, hasStationMsg } = d || {};
      dispatch({
        type: `user/${UPDATE_LOGIN_REDUCER}`,
        payload: {
          data: {
            ...userInfo,
            hasStationMsg,
            applyFlag,
            headImage,
            identityType,
            mobilePhone,
            nickName: nickname,
            roomId,
            sex,
            level: levelId,
            levelId
          }
        }
      });
    }
  );

  // 获取全局配置
  useRequest(
    () => getWebConfig().toPromise(),
    null,
    (d) => {
      const { global_switch } = d || {};

      configDispatch.setGlobalSwitchConfig(global_switch);
    }
  );

  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={1500}
      TransitionComponent={Grow}
    >
      <UseRequestProvider value={GlobalRequestOptions}>
        {children}
        <UpgradeDialog ref={upgradeRef} />
      </UseRequestProvider>
    </SnackbarProvider>
  );
};

export const useSnackbar = useNotistackSnackbar;
