import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import CopyToClipboard from 'copy-to-clipboard';
import {
  getRoomsQueryMatchListInfo,
  getStreamsLiveSetting,
  getStreamsPublishAddr,
  imageUpload
} from '@/servers/userServer';
import { getRoomDetail } from '@/servers/homeServer';
import { getArrayByLastValue } from '@/utils/common';
import { usePersistFn, useRequest } from '@/utils/hooks';
import { HttpCode } from '@/enums';
import Snackbar from '@material-ui/core/Snackbar';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';
import Form from './Form';
import EventSelection from './EventSelection';
import qqImg from '@/assets/images/liveContact/icon_qq_round.png';
import wxImg from '@/assets/images/liveContact/icon_wx_round.png';

import styles from '../style/LivePage.scss';

const LivePage = () => {
  const { roomId } = useSelector(({ user }) => user.userInfo || {});
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [contactShowStatus, setContactShowStatus] = useState('');
  const { data: { publishUrl, password } = {}, mutate, error } = useRequest(
    (q) => getStreamsPublishAddr(q).toPromise(),
    {},
    (d) => {
      const { url } = d || {};
      if (!url) return {};
      const index = url.lastIndexOf('/');

      return {
        publishUrl: url.substring(0, index),
        password: url.substr(index + 1)
      };
    }
  );
  const { data: matchListInfo } = useRequest(
    (q) => getRoomsQueryMatchListInfo(q).toPromise(),
    null,
    (d) => d || []
  );
  // 赛事选择回调
  const onMatchSelectHandle = usePersistFn((obj) => setFormData({
    ...formData,
    ...obj
  }));
  const { data: roomDetail } = useRequest(
    (q) => getRoomDetail(q).toPromise(),
    { roomId, protocolType: 'flv' },
    (d) => {
      const { title, announcement, room_img, anchor } = d || {};
      const { qqNo, wxNo, wxqqShowStatus } = anchor;
      setContactShowStatus(wxqqShowStatus);
      onMatchSelectHandle({
        roomLiveTitle: title,
        roomNotice: announcement,
        roomLiveImg: room_img,
        qqNo,
        wxNo
      });
    }
  );

  const eventRef = useRef();
  // 打开赛事选择
  const onOpenEventSelectionHandle = (e) => eventRef.current.open(e);

  useEffect(() => {
    if (error) setMessage(error.message);
  }, [error]);

  useEffect(() => {
    if (matchListInfo && matchListInfo.length && roomDetail) {
      const { match_id: detailMatchId } = roomDetail || {};
      if (!detailMatchId) return;
      const selectArr = getArrayByLastValue(matchListInfo, detailMatchId, 'matchId') || [];
      if (selectArr.length !== 3) return;

      const [
        { liveTypeId, liveTypeName } = {},
        { matchTypeId, matchTypeName } = {},
        { matchId: match_id, matchName, matchTime } = {}
      ] = selectArr;

      onMatchSelectHandle({
        liveTypeId,
        liveTypeName,
        matchTypeId,
        matchTypeName,
        match_id,
        matchName,
        matchTime
      });
    }
  }, [matchListInfo, roomDetail]);
  // 输入设置
  const onInputSetHandle = (f, event) => setFormData({ ...formData, [f]: event.target.value });
  // input上传文件点击
  const onUploadFileChange = async (e) => {
    const file = Array.prototype.slice.call(e.target.files)[0];
    e.target.value = null;

    const fd = new FormData();
    fd.append('file', file);

    const { data: { code, data, msg } } = await imageUpload(fd).toPromise();
    if (HttpCode.SUCCESS === code) {
      return setFormData({
        ...formData,
        roomLiveImg: data
      });
    }

    return setMessage(msg);
  };
  // 提交
  const onSubmitHandle = async () => {
    if (!formData.matchName) return setMessage('未选择关联赛事');

    const { data: { code, msg } } = await getStreamsLiveSetting(formData).toPromise();
    if (HttpCode.SUCCESS === code) mutate();

    return setMessage(msg);
  };
  // 复制
  const onCopyHandle = (v) => {
    CopyToClipboard(v);
    return setMessage('复制成功');
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>房间设置</div>
      <div className={styles.item}>
        <div className={styles.label}>
          <span className={styles.required}>*</span>
          <span>关联赛事</span>
        </div>
        <div className={styles.content}>
          <Form.Input
            value={formData.matchName || ''}
            onClick={onOpenEventSelectionHandle}
            style={{ cursor: 'pointer' }}
            readOnly
            placeholder="点击设置比赛"
            suffix={(<Iconfont name="xiala" className={styles.suffixIcon} />)}
          />
          <EventSelection ref={eventRef} onChange={onMatchSelectHandle} list={matchListInfo} />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>直播标题</div>
        <div className={styles.content}>
          <Form.Input
            placeholder="一句话的力量"
            value={formData.roomLiveTitle || ''}
            maxLength={15}
            onChange={(e) => onInputSetHandle('roomLiveTitle', e)}
          />
          <div className={styles.message}>留空默认取联名赛+对战双方名称：例如：英超曼联VS切尔西</div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>房间公告</div>
        <div className={styles.content}>
          <Form.Input
            placeholder="对您的观众们说点什么吧"
            inputTag="textarea"
            style={{ height: '76px', lineHeight: 1.5, paddingTop: '5px', paddingBottom: '5px' }}
            value={formData.roomNotice || ''}
            maxLength={30}
            onChange={(e) => onInputSetHandle('roomNotice', e)}
          />
          <div className={styles.message}>默认每5分钟更新一张直播画面截图，作为直播封面</div>
        </div>
      </div>
      <RenderJudge
        value={contactShowStatus == 1}
        active={(
          <div className={styles.item}>
            <div className={styles.label}>联系方式</div>
            <div className={styles.contactContent}>
              <div className={styles.contactItem}>
                <img src={qqImg} className={styles.contactIcon} />
                <span className={styles.contactTxt}>QQ</span>
                <Form.Input
                  placeholder="请输入您的QQ号码"
                  value={formData.qqNo || ''}
                  maxLength={11}
                  style={{width: '244px'}}
                  onChange={(e) => onInputSetHandle('qqNo', e)}
                />
              </div>
              <div className={styles.contactItem}>
                <img src={wxImg} className={styles.contactIcon} />
                <span className={styles.contactTxt}>微信</span>
                <Form.Input
                  placeholder="请输入您的微信"
                  value={formData.wxNo || ''}
                  maxLength={20}
                  style={{width: '244px'}}
                  onChange={(e) => onInputSetHandle('wxNo', e)}
                />
              </div>
            </div>
          </div>
        )}
      />
      <div className={styles.item}>
        <div className={styles.label}>直播封面</div>
        <div className={styles.content}>
          <div className={styles.upload}>
            <div>
              <Iconfont name="jia" className={styles.uploadIcon} />
              <div className={styles.uploadText}>点击上传</div>
            </div>
            <RenderJudge
              value={formData.roomLiveImg}
              active={<img src={formData.roomLiveImg} className={styles.preview} />}
            />
            <input className={styles.inputValue} type="file" accept={'image/*'} onChange={onUploadFileChange} />
          </div>
          <div className={styles.message}>发布精心挑选的封面可以让您的直播间吸引所有人的眼球</div>
        </div>
      </div>
      <div className={styles.submit}>
        <div className={styles.button} onClick={onSubmitHandle}>保存</div>
      </div>
      <div className={styles.title}>推流地址</div>
      <div className={styles.item}>
        <div className={ClassNames(styles.label, styles.isBigWidth)}>直播服务器/Fms/Url</div>
        <div className={styles.content}>
          <Form.Input placeholder="关联赛事后才能获取推流地址" readOnly value={publishUrl || ''} />
          <div className={styles.message}>设置比赛后，显示推流地址</div>
        </div>
        <div className={styles.handle}>
          <RenderJudge
            value={publishUrl}
            active={(<div className={styles.button} onClick={() => onCopyHandle(publishUrl)}>复制</div>)}
            inactive={(<div className={ClassNames(styles.button, styles.isDisable)}>复制</div>)}
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={ClassNames(styles.label, styles.isBigWidth)}>串流密钥/播放路径</div>
        <div className={styles.content}>
          <Form.Input placeholder="关联赛事后才能获取推流地址" readOnly value="******************" />
          <div className={styles.message}>设置比赛后，显示关键字</div>
        </div>
        <div className={styles.handle}>
          <RenderJudge
            value={password}
            active={(<div className={styles.button} onClick={() => onCopyHandle(password)}>复制</div>)}
            inactive={(<div className={ClassNames(styles.button, styles.isDisable)}>复制</div>)}
          />
        </div>
      </div>
      <Snackbar
        autoHideDuration={1500}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        message={message}
        key="default"
      />
    </div>
  );
};

export default LivePage;
