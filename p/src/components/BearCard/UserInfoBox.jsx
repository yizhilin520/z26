import React, { useState, useRef, useEffect, } from 'react'
import history from '@/utils/history'
import style from './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { homeAction, userAction } from '@/actions'

import Select from '@/components/Select';
import Iconfont from "@/components/Iconfont";
import { sessionStoragePut, sessionStorageGet } from '@/utils/regular'
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from '@/pages/user/components/Dialog';
import { getShutUpForbidSendMsg, getkickOutUser } from '@/servers/userServer';
import { HttpCode } from '@/enums';

const UserInfoBox = (props) => {
    // console.log('弹框', props)
    const { UserInfoClose, ChangUserInfo, headImage, nickname, level, fans, userId, account, room_id, userIsAnthor, isCurrentAnchor, isManage, } = props

    const [message, setMessage] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
    });
    const { vertical, horizontal, open } = snackbar;

    let shieldFasle01 = sessionStorageGet(userId);
    if (shieldFasle01 === undefined) {
        shieldFasle01 = true
    }

    const follow = () => {

    }
    const shieldClick = (userId) => {
        let timestamp = new Date().getTime();
        if (shieldFasle01 === true) {
            sessionStoragePut(userId, false)
            ChangUserInfo({ userIdIs: userId, isShield: false, timestamp: timestamp })
            setMessage("屏蔽成功");
            setSnackbar({ ...snackbar, open: true });
        } else {
            sessionStoragePut(userId, true)
            ChangUserInfo({ userIdIs: userId, isShield: true, timestamp: timestamp })
        }
    }

    const [visible, setVisible] = useState(false);
    const [iSoptType, setISoptType] = useState('1');
    const [visible2, setVisible2] = useState(false);
    // 禁言
    const onOpenDialog = () => {
        setVisible(true)
        setISoptType('1')
    }
    const onCloseHandle = () => {
        setVisible(false)
    }
    // 踢人
    const onOpenKicking = () => {
        // 如果是当前主播不能踢
        if (userIsAnthor === true) {
            return false
        }
        setVisible(true)
        setISoptType('2')
    }

    const messageRetur2 = (val) => {
        if (val.iSoptTypeDialog === 1) {
            setMessage(`用户已被禁言${val.forbidTimeMessage}`);
            setSnackbar({ ...snackbar, open: true });
        } else {
            ChangUserInfo({ userIdIs: userId, isShield: false, timestamp: 0 })
            setMessage(`您将${val.account}踢出您的直播间，踢出后该用户聊天记录将被清除，并${val.forbidTimeMessage}内无法进入`);
            setSnackbar({ ...snackbar, open: true });
        }
    }


    // const onCloseHandle2 = () => {
    //     setVisible2(false)
    // }


    // isCurrentAnchor=1 或isManage=true 为主播和房管，其它是普通用户
    return (
        <>
            <div className={style.userInfoBox}>
                <Iconfont
                    name="close"
                    className={style.infoClose}
                    onClick={UserInfoClose}
                />
                <div className={style.touxian}>
                    <div className={style.touxianLine}>
                        <img src={headImage} alt="#" className={style.touxianImg} />
                    </div>
                </div>
                <p className={style.infoText1}>{nickname}</p>
                <div className={style.lv}>LV  {level||1}</div>
                <div className={style.guanzhu}>
                    {/*<p className={style.guanzhuText}>关注:12</p>*/}
                    <p>粉丝:{fans}</p>
                </div>
                {
                    isCurrentAnchor === 1 || isManage === true ?
                        <div className={style.bottomZbao}>
                            <p className={style.bottomtext}>主页</p>
                            <p className={style.bottomtext}>关注</p>
                            <p className={style.bottomtext} onClick={onOpenDialog}>禁言</p>
                            <p className={style.bottomtext} onClick={onOpenKicking}>踢人</p>
                        </div>
                        :
                        <div className={style.bottom}>
                            <p className={`${style.guanzhuText2} `} onClick={() => follow()}>关注</p>
                            <p className={`${style.guanzhuText3} `} onClick={() => shieldClick(userId)}>{shieldFasle01 ? '屏蔽' : '解除屏蔽'}</p>
                        </div>
                }

            </div>

            <Dialog title={iSoptType === '1' ? "禁言" : "踢人"} visible={visible} onClose={onCloseHandle}>
                <NoSpeaking {...{ account, room_id, userId, iSoptType }} onClose={onCloseHandle} messageRetur={messageRetur2} />
            </Dialog>
            {/* <DialogKick  visible={visible2} onClose={onCloseHandle2}>
                <div className={style.kickUser}>
                        <p className={style.kickText}>
                            您确定将<span className={style.textColor}>樱桃小丸子</span>踢出您的直播间，踢出后该用户聊天记录将被清除，并<span className={style.textColor}>5分钟</span>内无法进入吗？
                        </p>
                        <div className={style.kickBtn}>
                            <button className={`${style.kickOk} ${style.kickOk22}`}>确定</button>
                            <button className={style.kickOk}>取消</button>
                        </div>

                </div>
            </DialogKick> */}

            <Snackbar
                autoHideDuration={1500}
                onClose={() => {
                    setSnackbar({ ...snackbar, open: false });
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                message={message}
                key={"default"}
            />
        </>
    )

}
export default UserInfoBox;

const NoSpeaking = (props) => {
    const { account, room_id, userId, iSoptType, onClose, messageRetur } = props || {};
    const [message1, setMessage1] = useState({});
    const [value, setValue] = useState({});

    // 时长
    const durationList = [{
        label: '1天',
        value: 0
    }, {
        label: '7天',
        value: 1
    }, {
        label: '1个月',
        value: 2
    }, {
        label: '永久',
        value: 3
    }];
    const violateList = [{
        label: '色情低俗',
        value: 0
    }, {
        label: '广告刷屏',
        value: 1
    }, {
        label: '恶意信息',
        value: 2
    }, {
        label: '违法违规',
        value: 3
    }];

    // input输入回调
    const onInputChangeHandle = (f, v) => {
        let val = v;
        if (v.target) val = v.target.value;
        const qy = { ...value, [f]: val };
        return setValue(qy);
    };

    // 禁言提交
    const onSubmitClicke = async () => {
        const { forbidTimeType, violateType } = value;

        if (typeof forbidTimeType === 'undefined') return setMessage1({ forbidTimeType: '禁言时长没有选择' });
        if (typeof violateType === 'undefined') return setMessage1({ violateType: '违规类型没有选择' });

        const params = { account: account, forbidTimeType, violateType, remark: '', roomId: room_id, optType: 1 };
        const { data: { code, msg } } = await getShutUpForbidSendMsg(params).toPromise();
        let forbidTimeMessage = '';
        for (let i = 0; i < durationList.length; i++) {
            if (durationList[i].value === forbidTimeType) {
                forbidTimeMessage = durationList[i].label
            }
        }
        if (HttpCode.SUCCESS === code) {
            // console.log('禁言', msg)
            onClose()
            return messageRetur({ account: account, forbidTimeMessage: forbidTimeMessage, iSoptTypeDialog: 1 });
        }
        return setMessage1({ violateType: msg });

    };
    // 踢人提交
    const onSubmitKicking = async () => {
        const { forbidTimeType, violateType } = value;
        if (typeof forbidTimeType === 'undefined') return setMessage1({ forbidTimeType: '踢人时长没有选择' });
        if (typeof violateType === 'undefined') return setMessage1({ violateType: '违规类型没有选择' });

        const params = { account: account, forbidTimeType, violateType, remark: '', roomId: room_id,uid:userId, optType: 2 };
        const { data: { code, msg } } = await getkickOutUser(params).toPromise();
        let forbidTimeMessage = '';
        for (let i = 0; i < durationList.length; i++) {
            if (durationList[i].value === forbidTimeType) {
                forbidTimeMessage = durationList[i].label
            }
        }

        if (HttpCode.SUCCESS === code) {
            onClose()
            // return messageRetur(`您将${account}踢出您的直播间，踢出后该用户聊天记录将被清除，并${}内无法进入`);
            return messageRetur({ account: account, forbidTimeMessage: forbidTimeMessage, iSoptTypeDialog: 2 });

        }
        return setMessage1({ violateType: msg });
    }

    return (
        <>
            {iSoptType === '1' ?
                <div className={style.kickTimeSele}>
                    <p className={style.speech}>将用户账号{account}禁言</p>
                    <div className={style.item}>
                        <p className={style.label}>禁言时长</p>
                        <div className={style.contentss}>
                            <Select
                                value={value.forbidTimeType}
                                list={durationList}
                                width={235}
                                placeholder="请选择禁言时长"
                                onChange={((v) => onInputChangeHandle('forbidTimeType', v))}
                            />
                            <p className={style.error}>{message1.forbidTimeType}</p>
                        </div>
                    </div>
                    <div className={style.item}>
                        <p className={style.label}>违规类型</p>
                        <div className={style.contentss}>
                            <Select
                                value={value.violateType}
                                list={violateList}
                                width={235}
                                placeholder="请选择违规类型"
                                onChange={((v) => onInputChangeHandle('violateType', v))}
                            />
                            <p className={style.error}>{message1.violateType}</p>
                        </div>
                    </div>
                    <div className={style.kickBtn} onClick={onSubmitClicke}>确认</div>
                </div>
                :
                <div className={style.kickTimeSele}>
                    <p className={style.speech}>将用户账号{account}踢出</p>
                    <div className={style.item}>
                        <p className={style.label}>踢出时长</p>
                        <div className={style.contentss}>
                            <Select
                                value={value.forbidTimeType}
                                list={durationList}
                                width={235}
                                placeholder="请选择禁言时长"
                                onChange={((v) => onInputChangeHandle('forbidTimeType', v))}
                            />
                            <p className={style.error}>{message1.forbidTimeType}</p>
                        </div>
                    </div>
                    <div className={style.item}>
                        <p className={style.label}>违规类型</p>
                        <div className={style.contentss}>
                            <Select
                                value={value.violateType}
                                list={violateList}
                                width={235}
                                placeholder="请选择违规类型"
                                onChange={((v) => onInputChangeHandle('violateType', v))}
                            />
                            <p className={style.error}>{message1.violateType}</p>
                        </div>
                    </div>
                    <div className={style.kickBtn} onClick={onSubmitKicking}>确认</div>
                </div>
            }
        </>

    )

};
