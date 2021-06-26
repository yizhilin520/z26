import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/reducers'
import ComponTabs from '@/components/tabs';
import LoginForm from '../../login/LoginForm';

import logincss from './style/login.scss';
import Zjh02 from './images/zjh02.png';
import Zjh03 from './images/zjh03.png';
import Zjh04 from './images/zjh04.png';

const ProfesLogin = () => {
  const dispatch = useDispatch()
  const controlLogin = useSelector((state) => state.home['controlLogin'])
  const { activeIndex, open } = controlLogin
  const [index, setIndex] = useState(activeIndex)
  const handleClose = () => {

  }

  return (
    <div className={logincss.page}>
      <div className={logincss.container}>
        <div className={logincss.loginBox}>
          <ComponTabs index={index} setIndex={setIndex} titles={['登录', '注册']} centered />
          <div className={logincss.loginctn}>
            <LoginForm index={index} onClose={handleClose} isOpen isProfessor />
          </div>

        </div>
        <div className={logincss.footer}>
          <ul className={logincss.ulText}>
            <li className={logincss.liText}>
              <img src={Zjh04} alt="#" className={logincss.liImg}/>
              <div className={logincss.liRight}>
                <p className={logincss.title}>关于专家号</p>
                <p className={logincss.titleText}>
                  u球开放自媒体平台，发布<br/>个性化内容，形式多样化
                </p>
              </div>
            </li>
            <li className={logincss.liText}>
              <img src={Zjh03} alt="#" className={logincss.liImg}/>
              <div className={logincss.liRight2}>
                <p className={logincss.title}>专家号福利</p>
                <p className={logincss.titleText}>
                顶级流量支持，超高频推荐曝光，<br/>优质创作者可开通收益补贴
                </p>
              </div>
            </li>
            <li className={logincss.liText}>
              <img src={Zjh02} alt="#" className={logincss.liImg}/>
              <div className={logincss.liRight3}>
                <p className={logincss.title}>如何入驻</p>
                <p className={logincss.titleText}>
                  打开pc端点击专家号填写基本信<br/>息即可进行认证入驻
                </p>
              </div>
            </li>
          </ul>

        </div>

      </div>
    </div>

  );
};

export default ProfesLogin;
