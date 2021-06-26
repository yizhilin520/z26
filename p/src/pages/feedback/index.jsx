import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import { validatePhone } from '@/utils/regular'
import { homeAction } from '@/actions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


import feed from './feed.scss';

const useStyles = makeStyles({
    root: {
      color: '#3683ff',
      '&$checked': {
        color: '#3683ff',
      },
      fontSize:12,
    },
    checked: { color: '#3683ff'},
    MuiTypography:{color: '#3683ff'}
  });

export default function Feedback() {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    const classes = useStyles();
    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
      setValue(event.target.value);
    };
    const [textValue, setTextValue] = useState('')
    const [phoneValue, setPhoneValue] = useState('')
    const textareaEl = useRef(null)
    const [errorPhone, setErrorPhone] =useState({
        errorStat:false, // false显示错误
        errorText:'',
        text: [
          '手机号不能为空',
          '手机号格式错误',
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
    const [arrImg, setArrImg] = useState([])

    const handleUpdate = (event) =>{
        if(arrImg.length > 4){
            setMsgskbar("最多可以上传5张图片")
            setSnackbar({ ...snackbar, open: true })
            return false
        }
        let fileImg =event.target.files[0];
        // console.log(fileImg)
        Accepts(fileImg)
      }
        // 图片格式限定
    const Accepts = (files) => {
        if(!files){
        return false
        }
        let type = Array.isArray(accepts) && accepts.indexOf(files.type,0)

        if(type >= 0){
        if (files.size > 2097152) {
            setMsgskbar("上传的文件不能大于2M")
            setSnackbar({ ...snackbar, open: true })
            return;
        }else{
            Preview(files)
    　　　　}
    }else{
        setMsgskbar("请上传格式为jpg、png，jpeg的图片")
        setSnackbar({ ...snackbar, open: true })
        }
    }

    // 本地预览
    const Preview = (file) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
        //   arr添加新数据
          setArrImg([...arrImg, this.result])
        }

      }

      const textChange = (val) =>{
        setTextValue(val)
        if(val === ''){
            textareaEl.current.style = 'display: block'
        }else{
            textareaEl.current.style = 'display: none'
          }

      }
      const PhoneChange = (val) =>{
        setPhoneValue(val)

        let test = validatePhone(val)
        errorPhone.errorStat = test[0]
        errorPhone.errorText = errorPhone.text[test[1]]
        setErrorPhone({...errorPhone})

      }
      const SaveBtnClick =() =>{
        if (!userInfo?.token) { // 无token===打开登陆
            dispatch({
              type: `home/${homeAction.UPDATE_OPEN_LOGIN}`,
              payload: { activeIndex: 0 }
            });
            return;
          }

          if(textValue === ''){
            textareaEl.current.style = 'display: block'
            return false;
          }else{
            textareaEl.current.style = 'display: none'
          }
          PhoneChange(phoneValue)
          if(errorPhone.errorStat === false){
            return false
          }

        setMsgskbar("上传成功")
        setSnackbar({ ...snackbar, open: true })
        window.location.reload();
      }

    return (
        <main>
            <Header isForecast />
            <div className={feed.feedback}>
                <div className={feed.title}>意见反馈</div>
                <div action="" className={feed.backform}>
                    <div className={feed.formitem}>
                        <label className={feed.itemlabel}>反馈类型：</label>
                        <div className={feed.itemCont}>
                            <div className={feed.radioGroup}>
                            <RadioGroup row  value={value} onChange={handleChange}>
                                <FormControlLabel value="female" control={<Radio color="primary" size="small" />} label="优化建议" />
                                <FormControlLabel value="male" control={<Radio color="primary" size="small"/>} label="数据不准" />
                                <FormControlLabel value="other" control={<Radio color="primary" size="small"/>} label="BUG问题" />
                                <FormControlLabel value="disabled" control={<Radio color="primary" size="small"/>} label="投诉" />
                                <FormControlLabel value="5" control={<Radio color="primary" size="small"/>} label="其他" />
                            </RadioGroup>

                            </div>
                        </div>
                    </div>
                    <div className={`${feed.formitem} ${feed.formitem2}`}>
                        <label className={feed.itemlabel}>反馈内容：</label>
                        <div className={feed.itemCont}>
                            <textarea name="" rows="10"  className={feed.wrapinput} onChange={(e) =>{textChange(e.target.value)}} placeholder='您的反馈将帮助我们尽快成长'></textarea>
                            <p className={feed.textError} ref={textareaEl}>请输入反馈内容</p>
                        </div>
                    </div>
                    <div className={feed.formitem3}>
                        <label className={feed.itemlabel}>添加图片：</label>
                        <div className={feed.rightCont}>
                            <div className={feed.uploadcot}>
                                <ul className={feed.uploadimg}>
                                    {
                                        arrImg?.length >0 && arrImg.map((item, index) =>{
                                            return(
                                                <li key={index}>
                                                    <img src={item} />
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                                <div className={feed.upload}>
                                    <div className={feed.plusA}>
                                        <span>+</span>
                                        <input type="file" onChange={(event) =>handleUpdate(event)}  className={feed.file}/>
                                    </div>
                                </div>

                            </div>
                            <p className={feed.tip}>仅支持JPG、PNG图片，且文件小于2M，最多上传5张</p>
                        </div>
                    </div>
                    <div className={feed.formitem4}>
                        <label className={feed.itemlabel}>您的手机：</label>
                        <div className={feed.rightCot}>
                            <input type="text" autoComplete='off' onChange={(e) =>{PhoneChange(e.target.value)}} className={feed.iteminput}/>
                            <p className={feed.phoneError} >{errorPhone.errorText}</p>
                        </div>
                    </div>
                    <div className={feed.formitem4}>
                        <label className={feed.itemlabel}>您的邮箱：</label>
                        <div className={feed.rightCot}>
                            <input type="text" autoComplete='off' className={feed.iteminput}/>
                        </div>
                    </div>
                    <div className={feed.formitem5}>
                        <button className={feed.saveBtn} onClick={() =>{SaveBtnClick()}}>提交</button>

                    </div>

                </div>
                <Snackbar
                    autoHideDuration={1000}
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