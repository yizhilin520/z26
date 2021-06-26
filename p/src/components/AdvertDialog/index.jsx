import React from 'react';
import { useLocation } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import { useRequest, useSafeState } from '@/utils/hooks';
import { getAdvertConfig } from '@/servers/live';
import { withStyles } from '@material-ui/core/styles';
import Iconfont from '@/components/Iconfont';
import RenderJudge from '@/components/RenderJudge';

import styles from './style/AdvertDialog.scss';

const MaterialDialog = withStyles(() => ({
  paper: {
    boxShadow: 'none',
    margin: 'auto',
    background: 'none',
    borderRadius: 'none',
    overflowY: 'initial'
  }
}))(Dialog);

const AdvertDialog = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showChildren, setShowChildren] = useSafeState(false);
  const { data, loading } = useRequest(
    (q) => getAdvertConfig(q).toPromise(),
    {},
    (d) => {
      const { advertConfig } = d || {};

      setShowChildren(!advertConfig);

      return advertConfig || {};
    }
  );

  if (loading) return null;

  if (!isHomePage || showChildren || !data) return children;

  return (
    <MaterialDialog scroll="body" open maxWidth={false}>
      <RenderJudge
        value={data.linkUrl}
        active={(
          // eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/control-has-associated-label,react/jsx-no-target-blank
          <a
            href={data.linkUrl}
            target="_blank"
            className={styles.wrapper}
            style={{ backgroundImage: `url('${data.logoUrl}')` }}
          />
        )}
        inactive={(
          <div className={styles.wrapper} style={{ backgroundImage: `url('${data.logoUrl}')` }} />
        )}
      />
      <Iconfont tag="div" name="close" className={styles.close} onClick={() => setShowChildren(true)} />
    </MaterialDialog>
  );
};

export default AdvertDialog;
