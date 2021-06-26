import React, { useRef } from 'react';
import ClassNames from 'classnames';
import { Helmet } from 'react-helmet';
import { useSetState } from 'ahooks';
import FooterTabs from '@/components/FooterTabs';
import TextDownload from '@/components/TextDownload';
import RenderJudge from '@/components/RenderJudge';
import Loading from '@/components/Loading';
import DownloadDialog from '@/components/DownloadDialog';
import { usePageViewDataReport } from '@/common/hooks';
import ExpertList from './components/ExpertList';
import PlanList from './components/PlanList';

import BannerImage from './images/banner_image.jpg';

import styles from './style/index.scss';

const ForecastPage = () => {
  const [loading, setLoading] = useSetState({ expert: true, plan: true });
  const dialogRef = useRef();

  const pageTitle = 'U球直播天天看，预测红单赚翻天';

  usePageViewDataReport('h5_4', { params: { event_value: '预测首页', page_title: pageTitle } });

  // 打开下载框
  const onOpenDownloadDialogHandle = () => dialogRef.current.open();

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="keywords" content="体育,赛事,直播,预测,红单,专家" />
        <meta name="description" content="专家大佬,带你看直播预测赛事,预测红单赚翻天。" />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.banner}>
          <img className={styles.bannerImage} src={BannerImage} />
        </div>
        <div className={ClassNames(styles.title, styles.isExpert)}>Top专家</div>
        <ExpertList onClick={onOpenDownloadDialogHandle} onLoading={(isLoading) => setLoading({ expert: isLoading })} />
        <div className={ClassNames(styles.title, styles.isPlan)}>方案推荐</div>
        <PlanList onClick={onOpenDownloadDialogHandle} onLoading={(isLoading) => setLoading({ plan: isLoading })} />
        <TextDownload />
      </div>
      <FooterTabs isForecast />
      <DownloadDialog ref={dialogRef} />
      <RenderJudge
        value={loading.expert || loading.plan}
        active={(<Loading />)}
      />
    </>
  );
};

export default ForecastPage;
