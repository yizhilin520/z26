import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getExpertExamineStatus, getExpertExamineSubmit, imageUpload } from '@/servers/userServer';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Stepper from '@/components/stepper/index2';
import '@/components/stepper/cssReset.css';
import RenderJudge from '@/components/RenderJudge';
import Iconfont from '@/components/Iconfont';
import { HttpCode } from '@/enums';
import Snackbar from '@material-ui/core/Snackbar';
import history from '@/utils/history';
import Form from './components/Form';
import renzhe from './style/renzhe.scss';

import img1 from './images/renzhe03.png';
import img2 from './images/renzhe04.png';

const ProfesApply = () => {
  const { headImage, account, uid, identityType } = useSelector(({ user }) => user.userInfo || {});

  const [stepNumber, setStepNumber] = useState();
  const [stepVale, setStepVale] = useState({ account, uid });

  const queryStatus = async () => {
    const { data: { code, msg, data } } = await getExpertExamineStatus({ userId: uid }).toPromise();
    if (HttpCode.SUCCESS === code) {
      // 0:待审核 1:审核通过 2:退回 -1:未申请过
      if (data.status === -1) {
        // identityType主播身份
        if (identityType === 1) {
          setStepNumber(1);
        } else {
          setStepNumber(0);
        }
      }
      if (data.status === 0) {
        setStepNumber(2);
      }
      if (data.status === 2) {
        setStepNumber(3);
      }
    }
  };
  useEffect(() => {
    queryStatus();
  }, []);

  const getStepNumber = (obj) => {
    const { userName, annexUrlFour, annexUrlFive } = obj || {};
    setStepNumber(obj.changeStep);
    setStepVale({ ...stepVale, userName, annexUrlFour, annexUrlFive });
  };

  return (
    <div>
      <Header />
      <div className={renzhe.renzhemain}>
        <div className={renzhe.ctn}>
          <div className={renzhe.stepperc}>
            <Stepper stepNumber={stepNumber} />
          </div>
          <RenderJudge
            value={stepNumber === 0}
            active={<StepperWarp1 getStepNumber={getStepNumber} />}
          />
          <RenderJudge
            value={stepNumber === 1}
            active={<StepperWarp2 {...stepVale} getStepNumber={getStepNumber} />}
          />
          <RenderJudge
            value={stepNumber === 2}
            active={<StepperWarp3 getStepNumber={getStepNumber} />}
          />
          <RenderJudge
            value={stepNumber === 3}
            active={<StepperWarp4 getStepNumber={getStepNumber} />}
          />

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfesApply;

const StepperWarp1 = (props) => {
  const { getStepNumber } = props;
  const [inputValue, setInputValue] = useState({ annexUrlFour: '', annexUrlFive: '' });
  const [message, setMessage] = useState({});

  // input输入回调
  const onInputChangeHandle = (f, event) => {
    setInputValue({ ...inputValue, [f]: event.target.value });
  };

  const userNameValid = () => {
    const { userName } = inputValue;
    if (!userName) {
      setMessage({ userName: '真实姓名不能为空' });
    } else if (userName.length < 2 || userName.length > 10) {
      setMessage({ userName: '请输入2-10位长度真实姓名' });
    } else if (!/^[A-Za-z\u4e00-\u9fa5]+$/gi.test(userName)) {
      setMessage({ userName: '真实姓名只允许字母，汉字' });
    } else {
      setMessage({ userName: '' });
      return true;
    }
  };
  const idNumberValid = () => {
    const { idNumber } = inputValue;
    if (!idNumber) {
      setMessage({ idNumber: '身份证号不能为空' });
    } else if (idNumber.length < 18 || idNumber.length > 18) {
      setMessage({ idNumber: '请输入18位身份证号' });
    } else if (!/^[A-Za-z0-9]+$/gi.test(idNumber)) {
      setMessage({ idNumber: '身份证号只允许数字，字母' });
    } else {
      setMessage({ idNumber: '' });
      return true;
    }
  };

  const [msgskbar, setMsgskbar] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, open } = snackbar;

  // input上传文件点击
  const onUploadFileImg = async (e, objName) => {
    const file = Array.prototype.slice.call(e.target.files)[0];
    e.target.value = null;

    const fd = new FormData();
    fd.append('file', file);

    const { data: { code, data, msg } } = await imageUpload(fd).toPromise();
    if (HttpCode.SUCCESS === code) {
      setInputValue({
        ...inputValue,
        [objName]: data
      });
    }
    setMsgskbar(msg);
    setSnackbar({ ...snackbar, open: true });
  };

  const onSubmit = () => {
    if (!userNameValid()) return false;
    if (!idNumberValid()) return false;
    if (!inputValue.annexUrlFour || !inputValue.annexUrlFive) {
      return setMessage({ imgEror: '身份证正反面照片请上传' });
    }
    // 跳转第2步骤
    getStepNumber({ ...inputValue, changeStep: 1 });
  };
  return (
    <div className={renzhe.renWarp}>
      <p className={renzhe.title}>专家号-实名认证</p>
      <div className={renzhe.sfz}>
        <div className={renzhe.inputctn}>
          <Form.Item label="真实姓名：" labelWidth="90px" inputWidth="277px" message={message.userName}>
            <Form.Input
              placeholder="请输入真实姓名"
              type="text"
              onChange={(e) => onInputChangeHandle('userName', e)}
            />
          </Form.Item>
        </div>
        <div className={renzhe.inputCtn2}>
          <Form.Item label="身份证号：" labelWidth="90px" inputWidth="277px" message={message.idNumber}>
            <Form.Input
              placeholder="请输入身份证号"
              type="text"
              maxLength={18}
              onChange={(e) => onInputChangeHandle('idNumber', e)}
            />
          </Form.Item>
        </div>
      </div>
      <div className={renzhe.sfzImg}>
        <p className={renzhe.title}>请上传本人手持身份证正反面照片：</p>
        <ul className={renzhe.uploadsfz}>
          <li className={renzhe.uploadLi1}>
            <RenderJudge
              value={inputValue.annexUrlFour}
              active={<img src={inputValue.annexUrlFour} className={renzhe.preview} />}
              inactive={(
                <div className={renzhe.uploadTips}>
                  <span style={{ color: '#999' }}>手持证件</span>
                  <span style={{ color: '#333' }}>正面照</span>
                </div>
              )}
            />
            <input
              className={renzhe.inputValue}
              type="file"
              accept={'image/*'}
              onChange={(e) => onUploadFileImg(e, 'annexUrlFour')}
            />
          </li>
          <li className={renzhe.uploadLi2}>
            <RenderJudge
              value={inputValue.annexUrlFive}
              active={<img src={inputValue.annexUrlFive} className={renzhe.preview} />}
              inactive={(
                <div className={renzhe.uploadTips}>
                  <span style={{ color: '#999' }}>手持证件</span>
                  <span style={{ color: '#333' }}>反面照</span>
                </div>
              )}
            />
            <input
              className={renzhe.inputValue}
              type="file"
              accept={'image/*'}
              onChange={(e) => onUploadFileImg(e, 'annexUrlFive')}
            />
          </li>
        </ul>
        <p className={renzhe.imgEror}>{message.imgEror}</p>
      </div>
      <button className={renzhe.Submit} onClick={onSubmit}>提交</button>
      <Snackbar
        autoHideDuration={1000}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false });
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        message={msgskbar}
        key="default"
      />
    </div>

  );
};

const StepperWarp2 = (props) => {
  const { mobilePhone, headImage } = useSelector(({ user }) => user.userInfo || {});
  const { uid, userName, account, annexUrlFour, annexUrlFive } = props || {};
  const { getStepNumber } = props;
  const [dataValue, setDataValue] = useState(props ? {
    userId: uid,
    loginName: account,
    userName,
    annexUrlFour,
    annexUrlFive
  } : {});
  const [message, setMessage] = useState({});
  const [strLength, setStrLength] = useState({
    expertName: 0, introduction: 0, applyReason: 0
  });

  const [storage, setStorage] = useState(true);
  const [msgskbar, setMsgskbar] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, open } = snackbar;

  // input输入回调
  const onInputChangeHandle = (f, v) => {
    let val = v;
    if (v.target) val = v.target.value;
    setDataValue({ ...dataValue, [f]: val });
    // 写字符串长度
    setStrLength({ ...strLength, [f]: val.length });
  };

  const expertNameValid = () => {
    const { expertName } = dataValue;
    if (!expertName) {
      setMessage({ expertName: '专家名称不能为空' });
    } else if (expertName.length < 2 || expertName.length > 16) {
      setMessage({ expertName: '请输入2-16位长度专家名称' });
    } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/gi.test(expertName)) {
      setMessage({ expertName: '专家名称只允许数字，字母，汉字' });
    } else {
      setMessage({ expertName: '' });
      return true;
    }
  };
  const introductionValid = () => {
    const { introduction } = dataValue;
    if (!introduction) {
      setMessage({ introduction: '专家简介不能为空' });
    } else if (introduction.length < 10 || introduction.length > 120) {
      setMessage({ introduction: '简介字数要求在10-120个字之间' });
    } else {
      setMessage({ introduction: '' });
      return true;
    }
  };
  const applyReasonValid = () => {
    const { applyReason } = dataValue;
    if (!applyReason) {
      setMessage({ applyReason: '申请理由不能为空' });
    } else if (applyReason.length < 10 || applyReason.length > 200) {
      setMessage({ applyReason: '请填写申请理由，要求在10-200个字之间' });
    } else {
      setMessage({ applyReason: '' });
      return true;
    }
  };

  const accepts = ['image/jpeg', 'image/jpg', 'image/png'];
  const [arrImg, setArrImg] = useState([]);

  const onSubmitClick = async () => {
    const [annexUrlOne, annexUrlTwo, annexUrlThree, annexUrlFour, annexUrlFive, annexUrlSix] = arrImg || [];
    const params = {
      ...dataValue,
      annexUrlOne,
      annexUrlTwo,
      annexUrlThree,
      annexUrlFour,
      annexUrlFive,
      annexUrlSix,
      mobile: mobilePhone,
      headUrl: headImage
    };
    if (!expertNameValid()) return false;
    if (!introductionValid()) return false;
    if (!applyReasonValid()) return false;
    if (!storage) {
      setMsgskbar('请阅读并同意专家号入驻合作协议');
      setSnackbar({ ...snackbar, open: true });
      return false;
    }

    const { data: { code, msg, data } } = await getExpertExamineSubmit(params).toPromise();
    if (HttpCode.SUCCESS === code) {
      getStepNumber({ changeStep: 2 });
    }
  };

  // input上传文件点击
  const onUploadFileChange = async (e) => {
    if (arrImg.length > 2) {
      setMsgskbar('最多可以上传3张图片');
      setSnackbar({ ...snackbar, open: true });
      return false;
    }
    const file = Array.prototype.slice.call(e.target.files)[0];
    e.target.value = null;

    const fd = new FormData();
    fd.append('file', file);

    const { data: { code, data, msg } } = await imageUpload(fd).toPromise();
    if (HttpCode.SUCCESS === code) {
      return setArrImg(arrImg.concat([data]));
    }

    setMsgskbar(msg);
    setSnackbar({ ...snackbar, open: true });
  };

  const deleteImg = (index) => {
    arrImg.splice(index, 1);
    setArrImg([...arrImg]);
  };

  return (
    <div className={renzhe.applyWarp}>
      <p className={renzhe.title}>专家号-专家申请</p>
      <div className={renzhe.item}>
        <Form.Item label="专家名称" labelWidth="70px" labelText="right" inputWidth="706px">
          <Form.Input
            placeholder="请输入专家名称"
            type="text"
            maxLength={16}
            onChange={(e) => onInputChangeHandle('expertName', e)}
          />
          <p className={renzhe.textnubmer}>
            {strLength.expertName}
            /16
          </p>
          <p className={renzhe.textBotton}>
            {message.expertName
              ? (
                <span className={renzhe.errorMessa}>
                  <span
                    className={renzhe.errorMeSpan}
                  >
                    !
                  </span>
                  {message.expertName}
                </span>
              )
              : '2~16字符，审核后将不可修改'}
          </p>
        </Form.Item>
      </div>
      <div className={renzhe.item}>
        <Form.Item label="专家简介" labelWidth="70px" labelText="right" inputWidth="706px">
          <Form.Input
            style={{ paddingTop: '10px', lineHeight: '20px' }}
            placeholder="请输入专家简介"
            type="text"
            inputTag="textarea"
            maxLengthNub="120"
            onChange={(e) => onInputChangeHandle('introduction', e)}
          />
          <p className={renzhe.textnubmer2}>
            {strLength.introduction}
            /120
          </p>
          <p className={renzhe.textBotton2}>
            {
              message.introduction
                ? (
                  <span className={renzhe.errorMessa}>
                    <span className={renzhe.errorMeSpan}>!</span>
                    {message.introduction}
                  </span>
                )
                : '10-120字，简介用于展示在专家号主页及部分文章列表'
            }
          </p>
        </Form.Item>
      </div>
      <div className={renzhe.item}>
        <Form.Item label="申请理由" labelWidth="70px" labelText="right" inputWidth="706px">
          <Form.Input
            style={{ paddingTop: '10px', lineHeight: '20px' }}
            placeholder="请输入申请理由"
            type="text"
            inputTag="textarea"
            maxLengthNub="200"
            onChange={(e) => onInputChangeHandle('applyReason', e)}
          />
          <p className={renzhe.textnubmer2}>
            {strLength.applyReason}
            /200
          </p>
          <p className={renzhe.textBotton2}>
            {message.applyReason
              ? (
                <span className={renzhe.errorMessa}>
                  <span
                    className={renzhe.errorMeSpan}
                  >
                    !
                  </span>
                  {message.applyReason}
                </span>
              )
              : '请填写您申请专家号专家的理由，200字以内'}
          </p>
        </Form.Item>
      </div>
      <div className={renzhe.item22}>
        <p className={renzhe.labeltext2}>材料证明</p>
        <div className={renzhe.uload}>
          <div className={renzhe.uloadCtn}>
            <ul className={renzhe.uploadimg}>
              {
                arrImg?.length > 0 && arrImg.map((item, index) => (
                  <li key={index} className={renzhe.upli} onClick={(e) => deleteImg(index)}>
                    <img src={item} className={renzhe.upimg} />
                    <div className={renzhe.delete}><Iconfont name="close" className={renzhe.deleteIcon} /></div>
                  </li>
                ))
              }
            </ul>
            <div className={renzhe.uloadWrap}>
              <Iconfont name="jia" className={renzhe.uploadIcon} />
              <input
                type="file"
                accept={'image/*'}
                className={renzhe.uloadIput}
                onChange={(event) => onUploadFileChange(event)}
              />
            </div>
          </div>

          <p className={renzhe.uloadTit}>请提供一些过往红单的记录、经典的分析案例图片，可以提高申请通过率。</p>

          <div className={renzhe.agree}>
            <CheckboxLab storage={storage} setStorage={setStorage} />
            <p className={renzhe.xieyiWrap}>
              阅读并同意
              <Link to={'/protocol/expert'} target={'_blank'} className={renzhe.xieyi}>《专家入驻合作协议》</Link>
            </p>
          </div>
          <button className={renzhe.SubmitApply} onClick={onSubmitClick}>提交</button>
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
        key="default"
      />

    </div>
  );
};

const StepperWarp3 = (props) => {
  const goToHome = () => {
    history.push('/');
  };
  return (
    <div className={renzhe.examine}>
      <img src={img1} alt="#" className={renzhe.examineImg} />
      <p className={renzhe.zili}>资料审核中…</p>
      <p className={renzhe.zilitext}>您的专家号申请已提交，耐心等待资料审核结果</p>
      <button className={renzhe.goHome} onClick={goToHome}>返回首页</button>

    </div>
  );
};

const StepperWarp4 = (props) => {
  const { getStepNumber } = props;
  const ReapplyClick = () => {
    getStepNumber({ changeStep: 0 });
  };
  return (
    <div className={renzhe.examine}>
      <img src={img2} alt="#" className={renzhe.examineImg} />
      <p className={renzhe.zili}>抱歉！申请失败</p>
      <p className={renzhe.zilitext}>您的申请没有通过审核，请检查资料重新申请！</p>
      <button className={renzhe.goHome} onClick={ReapplyClick}>重新申请</button>

    </div>
  );
};

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: ' 0 3px 0 0'
  }
});

const CheckboxLab = (props) => {
  const classes = useStyles();
  const { storage, setStorage } = props;
  return (
    <Checkbox
      className={classes.root}
      icon={<img src="/static/images/user/un-checked.webp" />}
      checkedIcon={<img src="/static/images/user/check.webp" />}
      checked={storage}
      onChange={(e) => setStorage(e.target.checked)}
      name="checkedB"
      color="primary"
    />
  );
};
