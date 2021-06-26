import React, { forwardRef, useImperativeHandle } from 'react';
import CopyToClipboard from 'copy-to-clipboard';
import { getLive365 } from '@/servers/scoreServer';
import { usePersistFn, useRequest, useSafeState } from '@/utils/hooks';
import { useSnackbar } from '@/plugins';
import RenderJudge from '@/components/RenderJudge';
import NotData from '@/components/NotData';
import Dialog from './Dialog';

import styles from '../style/MatchPlayAddress.scss';

const MatchPlayAddress = forwardRef((props, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const [visible, setVisible] = useSafeState(false);
  const [list, setList] = useSafeState([]);

  const { mutate, loading } = useRequest(
    (q) => getLive365(q).toPromise(),
    null,
    (d) => {
      setList(d || []);
    },
    {
      useManual: true
    }
  );

  // 打开
  const onOpenHandle = usePersistFn((match_id) => {
    setVisible(true);
    return mutate({ match_id });
  });
  // 关闭
  const onCloseHandle = usePersistFn(() => {
    setList([]);
    return setVisible(false);
  });
  // 复制
  const onCopyHandle = (v) => {
    CopyToClipboard(v);
    return enqueueSnackbar('复制成功');
  };

  useImperativeHandle(ref, () => ({
    open: onOpenHandle,
    close: onCloseHandle
  }));

  return (
    <Dialog title="比赛流地址" visible={visible} width={950} onClose={onCloseHandle}>
      <div className={styles.container}>
        <RenderJudge
          value={!loading && list.length}
          active={list.map((row, index) => {
            const [matchId, playUrl] = row || [];
            return (
              <div className={styles.item} key={index}>
                <div className={styles.label}>{`比赛流地址${index + 1}：`}</div>
                <div className={styles.value}>{playUrl}</div>
                <RenderJudge
                  value={playUrl}
                  active={(
                    <div className={styles.button} onClick={() => onCopyHandle(playUrl)}>复制</div>
                  )}
                />
              </div>
            );
          })}
          inactive={(<NotData />)}
        />
      </div>
    </Dialog>
  );
});

export default MatchPlayAddress;
