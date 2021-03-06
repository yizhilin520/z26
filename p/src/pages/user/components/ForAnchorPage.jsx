import React, { useRef, useState } from 'react';
import dayJs from 'dayjs';
import ClassNames from 'classnames';
import RenderJudge from '@/components/RenderJudge';
import Snackbar from '@material-ui/core/Snackbar';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';
import { useRequest } from '@/utils/hooks';
import { useSelector } from 'react-redux';
import { getAnchorMatchApply, getAnchorMatchApplyList, getMyPlanForecast, setForecastStatus, setForecastTop, getMyTvHistory } from '@/servers/userServer';
import { HttpCode } from '@/enums';
import OrderMatchList from './OrderMatchList';
import RecommendMatchList from './RecommendMatchList';
import Table from './Table';
import MatchPlayAddress from './MatchPlayAddress';
import ConfirmDialog from '@/pages/forecast/components/ConfirmDialog';

import styles from '../style/ForAnchorPage.scss';

const CustomPage = withStyles(() => ({
  root: {
    margin: '54px 28px 0'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(Pagination);

const ForAnchorPage = ({ ballType, matchStatus }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [message, setMessage] = useState(null);
  const [operatePlan, setOperatePlan] = useState({});
  const [query, setQuery] = useState({ pageNo: 1, limit: 20 });
  const [pageCount, setPageCount] = useState(0);
  const orderRef = useRef(null);
  const recommendRef = useRef(null);
  const { uid } = useSelector((state) => state.user.userInfo);
  const { expert } = useSelector(({ config }) => config.globalSwitch);
  const matchPlayAddressRef = useRef();
  const confirmRef = useRef();

  const { data: list = [], loading, mutate } = useRequest(
    (q) => getAnchorMatchApplyList(q).toPromise(),
    {},
    (d) => d || []
  );
  const { data: forecastList = [], loading: forecastLoading, mutate: forecastMutate } = useRequest(
    (q) => getMyPlanForecast(q).toPromise(),
    {userId: uid},
    (d) => d || []
  );
  const { data: liveRecordList = [], loading: liveRecordLoading, mutate: liveRecordMutate } = useRequest(
    (q) => getMyTvHistory(q).toPromise(),
    {pageNo: 1, limit: 20},
    ({rows, pages}) => {
      setPageCount(pages || 0);
      return rows || [];
    }
  );

  // ???????????????????????????
  const handleOpenOrderMatch = () => orderRef.current.open();
  // ????????????????????????
  const handleOpenRecommendMatch = () => recommendRef.current.open();

  const matchTableProps = [
    {
      label: '??????',
      width: '12%',
      formatter: ({ sportId }) => <div>{ballType[sportId]}</div>
    },
    {
      label: '??????',
      value: 'tournamentName',
      width: '22%'
    },
    {
      label: '??????',
      width: '26%',
      formatter: ({ homeTeamName, awayTeamName }) => (
        <div>{`${homeTeamName} VS ${awayTeamName}`}</div>
      )
    },
    {
      label: '????????????',
      width: '17%',
      formatter: ({ matchTime }) => (
        <div>{dayJs(matchTime).format('YYYY-MM-DD HH:mm')}</div>
      )
    },
    {
      label: '????????????',
      width: '12%',
      formatter: ({ applyStatus }) => <div>{matchStatus[applyStatus]}</div>
    },
    {
      label: '??????',
      width: '12%',
      formatter: ({ playStatus, applyStatus, matchTime, matchId }) => (
        <div className={styles.tableHandle}>
          <RenderJudge
            value={playStatus === 0 && applyStatus === 1}
            active={(
              <div
                className={styles.cancel}
                onClick={() => handleCancelOrder(playStatus, applyStatus, matchTime, matchId)}
              >
                ????????????
              </div>
            )}
          />
          <div className={styles.cancel} onClick={() => matchPlayAddressRef.current.open(matchId)}>?????????</div>
        </div>
      )
    }
  ];
  const forecastTableProps = [
    {
      label: '????????????',
      width: 239,
      formatter: ({ name, redNum, numM, numN, rate }) => (
        <div className={styles.expertInfo}>
          <div>{name}</div>
          <div className={styles.achievement}>
            <RenderJudge
              value={numM && numN}
              active={(<div>{`???${numM}???${numN}`}</div>)}
            />
            <RenderJudge
              value={redNum}
              active={(<div>&nbsp;&nbsp;{`${redNum}??????`}</div>)}
            />
            <RenderJudge
              value={rate}
              active={(<div>&nbsp;&nbsp;{`${rate}%?????????`}</div>)}
            />
          </div>
        </div>
      )
    },
    {
      label: '????????????',
      formatter: ({ matchInfoString }) => {
        const arr = matchInfoString.split('???')
        return (
          <div className={styles.matchInfo}>
            {
              arr.map((item, index) => (
                <div key={index} className={styles.matchItemInfo} title={item}>{item}</div>
              ))
            }
          </div>
        )
      }
    },
    {
      label: '????????????',
      width: 80,
      value: 'price'
    },
    {
      label: '????????????',
      width: 80,
      value: 'fee'
    },
    {
      label: '????????????',
      width: 80,
      formatter: ({ closeStatus, forecastStatus }) => (
        <div>
          {closeStatus === 3 ? '?????????' : forecastStatus === 1 ? '??????' : '??????'}
        </div>
      )
    },
    {
      label: '????????????',
      width: 80,
      formatter: ({ paySucCount }) => <div>{paySucCount}</div>
    },
    {
      label: '????????????',
      width: 80,
      formatter: ({ predictFee }) => <div>{predictFee}</div>
    },
    {
      label: '??????',
      width: 158,
      formatter: ({ planId, forecastTop, forecastStatus, closeStatus }) => (
        <RenderJudge value={closeStatus === 1 }
          active={
            (
              <div className={styles.operation}>
                <RenderJudge value={forecastTop === 1}
                  active={(
                    <div
                      className={styles.operateBtn}
                      onClick={() => handleTopStatus({planId, forecastTop})}
                    >
                      ????????????
                    </div>
                  )}
                  inactive={(
                    <div className={styles.operateBtn} onClick={() => handleTopStatus({planId, forecastTop})}>
                      ??????
                    </div>
                  )}
                />
                <RenderJudge value={forecastStatus > 0}
                  active={(
                    <div
                      className={styles.operateBtn}
                      onClick={() => onConfirmOpen({planId, forecastStatus})}
                    >
                      ??????
                    </div>
                  )}
                  inactive={(
                    <div className={styles.operateBtn} onClick={() => onConfirmOpen({planId, forecastStatus})}>
                      ??????
                    </div>
                  )}
                />
              </div>
            )
          }
          inactive={<></>}
        />
      )
    }
  ];
  const liveRecordTableProps = [
    {
      label: '????????????',
      width: 89,
      value: 'live_type_name'
    },
    {
      label: '????????????',
      width: 96,
      value: 'match_type_name'
    },
    {
      label: '????????????',
      width: 202,
      formatter: ({ room_title }) => <div className={styles.roomTitle}>{room_title}</div>
    },
    {
      label: '????????????',
      width: 159,
      formatter: ({ room_title }) => <div className={styles.roomTitle}>{room_title}</div>
    },
    {
      label: '????????????',
      width: 129,
      formatter: ({ start_date }) => (
        <div>
          {dayJs(start_date).format('YYYY-MM-DD HH:mm')}
        </div>
      )
    },
    {
      label: '????????????',
      width: 84,
      formatter: ({ end_date }) => <div>{end_date ? '?????????' : '?????????'}</div>
    },
    {
      label: '????????????(???)',
      width: 107,
      formatter: ({ second }) => <div>{Math.round(second / 60)}</div>
    },
    {
      label: '????????????',
      width: 85,
      value: 'visitorsNum'
    },
    {
      label: '????????????',
      width: 95,
      value: 'allGold'
    }
  ];

  const hanleGetList = () => mutate({});

  const handleGetForecastList = () => forecastMutate();

  const handleCancelOrder = async (playStatus, applyStatus, matchTime, matchId) => {
    if (Date.now() - new Date(matchTime).valueOf() > 0) {
      return setMessage('???????????????????????????????????????');
    }
    const {
      data: { code }
    } = await getAnchorMatchApply({
      matchId,
      matchTime: new Date(matchTime).valueOf(),
      uid,
      status: -1
    }).toPromise();
    if (HttpCode.SUCCESS === code) {
      setMessage('???????????????');
      return mutate({});
    }
  };

  const handleTopStatus = async ({planId, forecastTop}) => {
    const {
      data: { code, msg }
    } = await setForecastTop({
      userId: uid,
      planId,
      top: forecastTop === 1 ? 0 : 1
    }).toPromise();
    if (HttpCode.SUCCESS === code) {
      const text = forecastTop === 1 ? '???????????????' : '????????????'
      setMessage(text);
      return handleGetForecastList();
    } else {
      setMessage(msg)
    }
  };

  const onConfirmOpen = (data) => {
    confirmRef.current.open();
    setOperatePlan(data);
  };

  const handleForecastStatus = async () => {
    const {planId, forecastStatus} = operatePlan
    const {
      data: { code }
    } = await setForecastStatus({
      userId: uid,
      planId,
      status: forecastStatus > 0 ? -1 : 1
    }).toPromise();
    if (HttpCode.SUCCESS === code) {
      const text = forecastStatus > 0 ? '????????????' : '????????????'
      setMessage(text);
      return handleGetForecastList();
    }
  };

  // ????????????
  const onPageHandle = (event, page) => liveRecordMutate({ ...query, pageNo: page });

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={ClassNames(styles.titleLeft, {[styles.active]: activeTab === 1})} onClick={() => setActiveTab(1)}>????????????</div>
        <RenderJudge
          value={expert}
          active={(
            <div className={ClassNames(styles.titleLeft, {[styles.active]: activeTab === 2})} onClick={() => setActiveTab(2)}>????????????</div>
          )}
        />
        <div className={ClassNames(styles.titleLeft, {[styles.active]: activeTab === 3})} onClick={() => setActiveTab(3)}>????????????</div>
        <div className={styles.titleRight}>
          <RenderJudge
            value={activeTab === 1}
            active={
              <div className={styles.item}>
                <div className={styles.order} onClick={handleOpenOrderMatch}>
                  ????????????
                </div>
              </div>
            }
          />
          <RenderJudge
            value={activeTab === 2}
            active={
              <div className={styles.item}>
                <div className={styles.order} onClick={handleOpenRecommendMatch}>
                  ????????????
                </div>
              </div>
            }
          />
        </div>
      </div>

      <RenderJudge
        value={activeTab === 1}
        active={
          <div className={styles.list}>
            <Table
              list={list}
              props={matchTableProps}
              isNotData={!list.length && !loading}
            />
          </div>
        }
      />
      <RenderJudge
        value={activeTab === 2}
        active={
          <div className={styles.list}>
            <Table
              list={forecastList}
              props={forecastTableProps}
              isNotData={!forecastList.length && !forecastLoading}
              bodyCellStyle={{height: '72px', lineHeight: '72px'}}
            />
          </div>
        }
      />
      <RenderJudge
        value={activeTab === 3}
        active={
          <div className={styles.list}>
            <Table
              list={liveRecordList}
              props={liveRecordTableProps}
              isNotData={!liveRecordList.length && !liveRecordLoading}
            />
          </div>
        }
      />

      <OrderMatchList
        ref={orderRef}
        className={styles.abcd}
        ballType={ballType}
        onChange={hanleGetList}
      />
      <RecommendMatchList
        ref={recommendRef}
        className={styles.abcd}
        ballType={ballType}
        onChange={handleGetForecastList}
      />
      <Snackbar
        autoHideDuration={2000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        message={message}
        key="default"
      />
      <MatchPlayAddress ref={matchPlayAddressRef} />
      <ConfirmDialog ref={confirmRef} onConfirm={handleForecastStatus} text={`?????????${operatePlan.forecastStatus <= 0 ? '??????' : '??????'}???????????????`} />
      {/* ?????????????????? */}
      <RenderJudge
        value={activeTab === 3}
        active={(<CustomPage page={query.page} count={pageCount} onChange={onPageHandle} />)}
      />
    </div>
  );
};

ForAnchorPage.defaultProps = {
  ballType: {
    1: '??????',
    2: '??????'
  },
  matchStatus: {
    1: '?????????',
    '-1': '?????????'
  }
};

export default ForAnchorPage;
