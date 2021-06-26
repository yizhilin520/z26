import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
import dayJs from 'dayjs';
import { getRequestUrlParams } from '@/utils/common';
import { useLogin, usePageViewDataReport, useRequest, useSafeState, useScroll } from '@/utils/hooks';
import { useSnackbar } from '@/plugins';
import { getExpertPlanInfo, goldFlowPurchasePlan } from '@/servers/scoreServer';
import { HttpCode } from '@/enums';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RenderJudge from '@/components/RenderJudge';
import SideTools from '@/components/SideTools';
import Image from '@/components/Image';
import DefaultBasketballMatchImage from '@/assets/images/default_basketball_match_image.png';
import DefaultFootballMatchImage from '@/assets/images/default_football_match_image.png';
import AbortImage from '@/pages/forecast/detail/images/abort_image.png';
import { Helmet } from 'react-helmet';
import { millisecondFormat, timeFormat } from '../utils/format';
import Main from '../components/Main';
import BreadCrumbs from '../components/BreadCrumbs';
import UserInfo from '../components/UserInfo';
import ExpertPlanList from '../components/ExpertPlanList';
import ConfirmDialog from '../components/ConfirmDialog';

import StatusRedImage from '../images/status_red_image.png';
import StatusBackImage from '../images/status_black_image.png';
import StatusWalkImage from '../images/status_walk_image.png';

import styles from './style/index.scss';

const DetailPage = ({ match: { params: { sportId, expertId, planId } }, location }) => {
  const { roomId, anchorId } = getRequestUrlParams(location.search);
  const confirmRef = useRef();
  const timeInstanceRef = useRef();

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { uid } = useSelector(({ user }) => user.userInfo || {});
  const { isLogin, login } = useLogin();
  // 内容显示(售卖截止:abort,内容:content,售卖倒计时:timer)
  const [contentShowType, setContentShowType] = useSafeState(null);
  const [timeObj, setTimeObj] = useSafeState({ hour: 0, minute: 0, second: 0 });
  const [breadCrumbsList, setBreadCrumbsList] = useSafeState([]);
  const [data, setData] = useSafeState({});
  // 在售方案列表(过滤到当前在查看的方案)
  const saleList = (data.sale || []).filter((r) => r.planId !== planId);

  const clearCountDownHandle = () => clearTimeout(timeInstanceRef.current);

  const countDownHandle = (s) => {
    clearCountDownHandle();
    const { hour, minute, second } = millisecondFormat(s);
    setTimeObj({
      hour,
      minute,
      second
    });
    if (s <= 0) {
      setContentShowType('abort');
    } else {
      timeInstanceRef.current = setTimeout(() => countDownHandle(s - 1000), 1000);
    }
  };

  const { loading, mutate } = useRequest(
    (q) => getExpertPlanInfo(q).toPromise(),
    { sportId, expertId, planId, userId: uid },
    (d) => {
      const { planInfo } = d || {};
      const info = planInfo || {};
      const { nickName, closeStatus, isFree, isPlay, endTime, freeTime, isSelf } = info;

      if (nickName) setBreadCrumbsList([{ label: nickName }]);

      if (isFree || isPlay || isSelf || (freeTime && freeTime - Date.now() <= 0)) {
        setContentShowType('content');
      } else if (closeStatus === 3) {
        setContentShowType('abort');
      } else {
        clearCountDownHandle();
        if (endTime) countDownHandle(endTime - Date.now());
        setContentShowType('timer');
      }

      setData(info);
    }
  );

  usePageViewDataReport('web_41', {
    params: {
      event_value: '红单详情页',
      page_title: `${data?.nickName} ${data?.summary}`
    },
    ready: !loading
  });

  const { top } = useScroll();
  const submitFixed = useMemo(() => {
    const { documentElement, body } = document;
    const { scrollHeight, clientHeight } = documentElement || {};
    const { scrollHeight: bodyScrollHeight, clientHeight: bodyClientHeight } = body || {};

    return (scrollHeight || bodyScrollHeight) - top >= (clientHeight || bodyClientHeight) + 320;
  }, [top, loading]);

  useEffect(() => () => clearCountDownHandle(), []);
  useEffect(() => {
    if (!loading) mutate();
  }, [planId]);

  const onLinkChangeHandle = (row, e) => {
    if (new RegExp(row.planId).test(planId)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const onPaySubmitHandle = () => {
    if (!isLogin) return login();

    return confirmRef.current.open();
  };
  // 支付
  const onPayHandle = async () => {
    const { data: { code, msg } } = await goldFlowPurchasePlan({
      userId: uid,
      planId,
      amount: data.price,
      roomId,
      anchorId
    }).toPromise();
    if (HttpCode.SUCCESS === code) {
      enqueueSnackbar('购买成功');
      return mutate();
    }
    // 用户金额不足的时候，需要跳转到充值页面
    if (code === 1000001) history.push('/user/assets');
    return enqueueSnackbar(msg);
  };
  // 获取详情页面地址
  const getDetailLinkUrlHandle = (row) => `/forecast/detail/${sportId}/${expertId}/${row.planId}`;

  // 销售状态对象
  const closeStatusObj = {
    1: '在售',
    3: '已结束'
  };
  // 状态图片
  const statusImage = { 1: StatusRedImage, 2: StatusBackImage, 4: StatusWalkImage }[data.hitStatus];

  return (
    <>
      <Helmet>
        {
          (data?.nickName || data?.summary) ? (
            <title>{`${data?.nickName} ${data?.summary}`}</title>
          ) : ''
        }
      </Helmet>
      <Header isForecast />
      <Main>
        <BreadCrumbs list={breadCrumbsList} />
        <div className={styles.container}>
          <UserInfo expertId={expertId} />
          <ExpertPlanList
            className={styles.wrapper}
            beforeChildren={(
              <RenderJudge
                value={loading}
                inactive={(
                  <div className={styles.content}>
                    <div className={styles.title}>{data.summary}</div>
                    <RenderJudge
                      value={data.createTime}
                      active={(
                        <div className={styles.publishTime}>{timeFormat(data.createTime)}</div>
                      )}
                    />
                    {(data.matchPlanTradeList || []).map((row, index) => {
                      const isShowScoreText = row.matchStatus === 2 || row.matchStatus === 3;
                      let currentStatusImage = statusImage;

                      return (
                        <div className={styles.match} key={index}>
                          <div className={styles.header}>
                            <div className={styles.status}>{closeStatusObj[data.closeStatus]}</div>
                            <div className={styles.text}>{`【${data.lotteryClassName}】${row.tournamentName}`}</div>
                            <div className={styles.delimiter} />
                            <div className={styles.text}>{dayJs(row.matchTime).format('MM-DD HH:mm')}</div>
                          </div>
                          <div className={styles.info}>
                            <div className={styles.team}>
                              {/* <div className={styles.index}>让球</div> */}
                              <RenderJudge
                                value={row.sportId === 1}
                                active={(
                                  <>
                                    <div className={styles.name}>{row.homeTeamName}</div>
                                    <Image
                                      className={styles.logo}
                                      src={row.homeTeamLogo}
                                      defaultImage={DefaultFootballMatchImage}
                                    />
                                    <RenderJudge
                                      value={isShowScoreText}
                                      active={(
                                        <>
                                          <div className={styles.score}>{row.homeTeamScore}</div>
                                          <div className={styles.sign}>:</div>
                                          <div className={styles.score}>{row.awayTeamScore}</div>
                                        </>
                                      )}
                                      inactive={(<div className={styles.score}>VS</div>)}
                                    />
                                    <Image
                                      className={styles.logo}
                                      src={row.awayTeamLogo}
                                      defaultImage={DefaultFootballMatchImage}
                                    />
                                    <div className={styles.name}>{row.awayTeamName}</div>
                                  </>
                                )}
                                inactive={(
                                  <>
                                    <div className={styles.name}>{row.awayTeamName}</div>
                                    <Image
                                      className={styles.logo}
                                      src={row.awayTeamLogo}
                                      defaultImage={DefaultBasketballMatchImage}
                                    />
                                    <RenderJudge
                                      value={isShowScoreText}
                                      active={(
                                        <>
                                          <div className={styles.score}>{row.awayTeamScore}</div>
                                          <div className={styles.sign}>:</div>
                                          <div className={styles.score}>{row.homeTeamScore}</div>
                                        </>
                                      )}
                                      inactive={(<div className={styles.score}>VS</div>)}
                                    />
                                    <Image
                                      className={styles.logo}
                                      src={row.homeTeamLogo}
                                      defaultImage={DefaultBasketballMatchImage}
                                    />
                                    <div className={styles.name}>
                                      <span>{row.homeTeamName}</span>
                                      <small className={styles.mainText}>(主)</small>
                                    </div>
                                  </>
                                )}
                              />
                            </div>
                            {(row.planTrades || []).map(({ tradeName, recommedIndex, redIndex }, subIndex) => {
                              // 主、平、客
                              const tradeList = (tradeName || '').split(';');
                              // 推荐
                              const recommendArr = (recommedIndex || '').split(';');

                              return (
                                <div className={styles.item} key={subIndex}>
                                  {/* <div className={styles.index}>0</div> */}
                                  {tradeList.map((trade, tradeIndex) => {
                                    const [label, value] = (trade || '').split(/\s+/);
                                    const indexVal = tradeIndex + 1;
                                    const isRecommend = recommendArr.indexOf(`${indexVal}`) > -1;
                                    const isSelect = redIndex === indexVal;
                                    if (isSelect && isRecommend) currentStatusImage = StatusRedImage;

                                    return (
                                      <div
                                        className={ClassNames(styles.box, {
                                          [styles.isRecommend]: isRecommend,
                                          [styles.isSelect]: isSelect
                                        })}
                                        key={tradeIndex}
                                      >
                                        <div className={styles.label}>{label}</div>
                                        <div className={styles.value}>{value}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                            <RenderJudge
                              value={currentStatusImage}
                              active={(<img className={styles.statusImage} src={currentStatusImage} />)}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <RenderJudge
                      value={contentShowType}
                      active={(
                        <>
                          <div className={styles.reasonTitle}>推荐理由</div>
                          <div className={styles.reasonContent}>
                            <RenderJudge
                              value={contentShowType === 'content'}
                              active={(
                                <div
                                  className={styles.reasonText}
                                  dangerouslySetInnerHTML={{ __html: data.planContent }}
                                />
                              )}
                            />
                            <RenderJudge
                              value={contentShowType === 'abort'}
                              active={(
                                <div className={styles.abortContent}>
                                  <img className={styles.abortImage} src={AbortImage} />
                                  <div className={styles.abortText}>售卖已截止</div>
                                </div>
                              )}
                            />
                            <RenderJudge
                              value={contentShowType === 'timer'}
                              active={(
                                <div className={styles.reasonTimer}>
                                  <div className={styles.timerContent}>
                                    <div className={styles.timerText}>距离售卖截止还有：</div>
                                    <div className={styles.timerValue}>{timeObj.hour}</div>
                                    <div className={styles.timerDot} />
                                    <div className={styles.timerValue}>{timeObj.minute}</div>
                                    <div className={styles.timerDot} />
                                    <div className={styles.timerValue}>{timeObj.second}</div>
                                  </div>
                                  <div className={styles.reasonPact}>
                                    <div className={styles.pactLabel}>购买代表您已阅读并同意</div>
                                    <Link
                                      to="/protocol/user"
                                      target="_blank"
                                      className={ClassNames(styles.pactLabel, styles.isLink)}
                                    >
                                      《用户协议》
                                    </Link>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </>
                      )}
                    />
                    <RenderJudge
                      value={data.sale && data.sale.length}
                      active={(<div className={styles.schemeTitle}>TA的在售方案</div>)}
                    />
                  </div>
                )}
              />
            )}
            loading={loading}
            showUserInfo={false}
            showNotData={false}
            list={saleList}
            getLinkUrl={getDetailLinkUrlHandle}
            onLinkChange={onLinkChangeHandle}
          />
        </div>
      </Main>
      <RenderJudge
        value={!data.isFree && !data.isPlay && !data.isSelf && contentShowType && contentShowType !== 'abort'}
        active={(
          <div className={ClassNames(styles.submit, { [styles.isFixed]: submitFixed })}>
            <div className={styles.submitWrapper}>
              <div className={styles.inner}>
                <div className={styles.money}>
                  <span className={styles.label}>需支付：</span>
                  <span className={styles.value}>{`${data.price}金币`}</span>
                </div>
                <div className={styles.button} onClick={onPaySubmitHandle}>立即支付</div>
              </div>
            </div>
          </div>
        )}
      />
      <ConfirmDialog ref={confirmRef} onConfirm={onPayHandle} text={`购买本方案需要消耗${data.price}金币，确定购买么？`} />
      <SideTools />
      <Footer />
    </>
  );
};

export default DetailPage;
