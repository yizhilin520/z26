import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import Snackbar from '@material-ui/core/Snackbar';

import { validateQq } from '@/utils/regular'
import { homeAction } from '@/actions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import feed from './report.scss';
import history from '@/utils/history'

export default function Report() {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    const [textValue, setTextValue] = useState('')
    const textareaEl = useRef(null)
    const [errorPhone, setErrorPhone] = useState({
        errorStat: false, // false显示错误
        errorText: '',
        text: [
            'QQ号不能为空',
            'QQ号格式错误',
            ''
        ]
    })

    // 弹框提醒消息
    const [msgskbar, setMsgskbar] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center'
    });
    const { vertical, horizontal, open } = snackbar;

    let accepts = ['image/jpeg', 'image/jpg', 'image/png']
    const [arrImg, setArrImg] = useState()
    const [errorMessage, setErrorMessage] = useState({});

    const handleUpdate = (event) => {
        let fileImg = event.target.files[0];
        Accepts(fileImg)
    }
    // 图片格式限定
    const Accepts = (files) => {
        if (!files) {
            return false
        }
        let type = Array.isArray(accepts) && accepts.indexOf(files.type, 0)
        if (type >= 0) {
            if (files.size > 2097152) {
                setMsgskbar("上传的文件不能大于2M")
                setSnackbar({ ...snackbar, open: true })
                return;
            } else {
                Preview(files)
            }
        } else {
            setMsgskbar("请上传格式为jpg、png，jpeg的图片")
            setSnackbar({ ...snackbar, open: true })
        }
    }
    // 本地预览
    const Preview = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            setArrImg(this.result)
        }
        return setErrorMessage({ imgError: '' })
    }

    const textChange = (val) => {
        setTextValue(val)
        if (val === '') {
            return setErrorMessage({ textar: '请输入反馈内容' })
        } else {
            return setErrorMessage({ textar: '' })
        }
    }
    const PhoneChange = (val) => {
        let test = validateQq(val)
        errorPhone.errorStat = test[0]
        errorPhone.errorText = errorPhone.text[test[1]]
        setErrorPhone({ ...errorPhone })

    }
    const SaveBtnClick = () => {
        if (!userInfo?.token) { // 无token===打开登陆
            dispatch({
                type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
                payload: { activeIndex: 0 }
            });
            return;
        }

        if (textValue === '') {
            return setErrorMessage({ textar: '请输入反馈内容' })
        }
        if (!arrImg) {
            return setErrorMessage({ imgError: '请选择截图' })
        }

        setMsgskbar("谢谢您的举报，我们会尽快处理")
        setSnackbar({ ...snackbar, open: true })
        setTimeout(() =>{
            window.location.reload();
        },1500)

    }

    return (
        <main>
            <Header isForecast />
            <div className={feed.feedback}>
                <div className={feed.title}><p className={feed.titleLab1}>举报房间</p> <p className={feed.titleLab2}>带<span>*</span>的为必填项</p></div>
                <div action="" className={feed.backform}>
                    <div className={`${feed.formitem} ${feed.formitem2}`}>
                        <label className={feed.itemlabel}>反馈内容：</label>
                        <div className={feed.itemCont}>
                            <textarea name="" rows="10" maxLength="200" className={feed.wrapinput} onChange={(e) => { textChange(e.target.value) }} placeholder='请输入详细说明'></textarea>
                            <div className={feed.inputTit}>详细细节描述，最大200字符</div>
                            <p className={feed.textError} ref={textareaEl}>{errorMessage.textar}</p>
                        </div>
                    </div>
                    <div className={feed.lienr}></div>
                    <div className={feed.formitem3}>
                        <label className={feed.itemlabel}>添加图片：</label>
                        <div className={feed.rightCont}>
                            <div className={feed.uploadcot}>
                                <ul className={feed.uploadimg}>
                                    {arrImg ?
                                        <li >
                                            <img src={arrImg} />
                                        </li>
                                        : null
                                    }

                                </ul>
                                <div className={feed.upload}>
                                    <div className={feed.plusA}>
                                        选择截图
                                        <input type="file" onChange={(event) => handleUpdate(event)} className={feed.file} />
                                    </div>
                                </div>
                                <span className={feed.tip}>一张，大小限制1M</span>
                            </div>
                            <p className={feed.errorTip}>{errorMessage.imgError}</p>
                        </div>
                    </div>
                    <div className={feed.lienr}></div>
                    <div className={feed.formitem4}>
                        <label className={feed.itemlabel}>QQ：</label>
                        <div className={feed.rightCot}>
                            <input type="text" autoComplete='off' onChange={(e) => { PhoneChange(e.target.value) }} className={feed.iteminput} placeholder="请输入QQ" />
                            <p className={feed.phoneError} >{errorPhone.errorText}</p>
                        </div>
                    </div>
                    <div className={feed.formitem5}>
                        <button className={feed.saveBtn} onClick={() => { SaveBtnClick() }}>提交</button>
                        <span className={feed.goHome} onClick={() => { history.push('/') }}>返回首页</span>
                    </div>

                </div>
                <Snackbar
                    autoHideDuration={1500}
                    onClose={() => {
                        setSnackbar({ ...snackbar, open: false });
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    message={msgskbar}
                    key={'default'}
                />
            </div>
            <Footer />
        </main>
    )

}