import React, { useRef } from 'react';
import { useRequest } from 'ahooks';
import { Helmet } from 'react-helmet';
import { getMatchInfo } from '@/services/sports';
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';
import DownloadDialog from '@/components/DownloadDialog';
import RoomLayout from '@/components/RoomLayout';
import RenderJudge from '@/components/RenderJudge';
import { usePageViewDataReport } from '@/common/hooks';
import useRouterStores from '@/store/getters/router';
import FootballOverview from './components/FootballOverview';
import BasketballOverview from './components/BasketballOverview';
import HeaderMatchInfo from './components/HeaderMatchInfo';
import MatchIndex from './components/MatchIndex';

const ScoreDetailMain = ({ data }) => {
  const [matchId, , homeTeamName, awayTeamName, , , sportType] = data;
  const dialogRef = useRef();

  const { getConfig } = useRouterStores();
  const displayScoreModule = getConfig?.displayScoreModule || [];
  // 1赛况 2方案 3聊天 4直播 5指数
  const showIndex = displayScoreModule.find(({ id }) => id === 5);

  const pageTitle = `${homeTeamName} VS ${awayTeamName}`;

  usePageViewDataReport('h5_21', { params: { event_value: '比分落地页', page_title: pageTitle } });

  // 打开下载弹框
  const onOpenDownloadDialogHandle = () => dialogRef.current.open();

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="足球直播,篮球直播,比赛直播" />
      </Helmet>
      <RoomLayout.Provider chatId={matchId}>
        {({ messages }) => (
          <RoomLayout
            player={(
              <HeaderMatchInfo data={data} />
            )}
            tabs={[{
              label: '赛况',
              component: (
                <>
                  <RenderJudge
                    value={sportType === 1}
                    active={(<FootballOverview data={data} />)}
                  />
                  <RenderJudge
                    value={sportType === 2}
                    active={(<BasketballOverview data={data} />)}
                  />
                </>
              )
            }, {
              label: '聊天',
              component: (<RoomLayout.Message
                list={messages}
                onMessage={onOpenDownloadDialogHandle}
                onGift={onOpenDownloadDialogHandle}
              />)
            }, showIndex && {
              label: '指数',
              component: (<MatchIndex data={data} />)
            }].filter(Boolean)}
            showBack={false}
          />
        )}
      </RoomLayout.Provider>
      <DownloadDialog ref={dialogRef} />
    </>
  );
};

const ScoreDetailPage = ({ match: { params: { id } }, history }) => {
  const { data, loading } = useRequest(
    () => getMatchInfo({ match_id: id }),
    {
      initialData: [],
      defaultLoading: true,
      refreshDeps: [id]
    }
  );

  const onToastCloseHandle = () => history.replace('/score');

  if (loading) return (<Loading />);
  if (!data.length) return (<Toast visible text="页面不存在" duration={2000} onClose={onToastCloseHandle} />);
  return (<ScoreDetailMain data={data} />);
};

export default ScoreDetailPage;
