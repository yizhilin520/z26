import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import useSafeState from 'ahooks/lib/useSafeState';
import FooterTabs from '@/components/FooterTabs';
import RenderJudge from '@/components/RenderJudge';
import Loading from '@/components/Loading';

import styles from './style.scss';

const url = 'https://m.uqiu.com/download/h5down/index.html';
const DownloadPage = () => {
  useEffect(() => {
    window.location.assign(url);
  }, []);

  const [loading, setLoading] = useSafeState(true);
  return (
    <div className={styles.container}>
      <Helmet>
        <title>足球篮球赛事直播_即时比分数据分析APP-APP下载-U球体育</title>
        <meta name="keywords" content="足球赛事app下载,篮球赛事app下载,足球比分app下载,篮球比分分析app下载" />
        <meta name="description" content="全球赛事尽在U球体育，覆盖足球、篮球、电竞、网球、棒球各类比赛，带你有理有据看比赛，最快最即时的比分数据；超级直播间，更多精彩互动；资讯社区掌握体坛动态。" />
      </Helmet>
      <iframe
        title="下载APP"
        src={url}
        className={styles.iframe}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        scrolling="auto"
        onLoad={() => setLoading(false)}
      />
      <FooterTabs isDownload />
      <RenderJudge
        value={loading}
        active={(<Loading />)}
      />
    </div>
  );
};

export default DownloadPage;
