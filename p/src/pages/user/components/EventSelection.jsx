import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ClassNames from 'classnames';
import { useRequest } from 'ahooks';
import {empty, getArrayByLastValue} from '@/utils/common';
import { timeFormat } from '@/utils/regular';
import { getLiveCategoryList } from '@/servers/live';
import Snackbar from '@material-ui/core/Snackbar';
import RenderJudge from '@/components/RenderJudge';
import Dialog from './Dialog';
import EventInput from './EventInput';

import styles from '../style/EventSelection.scss';

const EventSelection = forwardRef(({ list, onChange }, ref) => {
  const [{ searchVal, searchStat = false }, setSearch] = useState({});

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, open } = snackbar;

  const { data: liveCategoryData = [], run: runLiveCategory } = useRequest(
    () => getLiveCategoryList().toPromise(),
    {
      initialData: [],
      manual: true
    }
  );
  const liveCategoryList = liveCategoryData.filter(({ matchType }) => (matchType !== 1 && matchType !== 2));

  const [
    {
      liveTypeId = list[0]?.liveTypeId,
      liveTypeName,
      matchTypeList = list[0]?.children,
      showInput
    },
    setMatchType
  ] = useState({});
  const [{ matchTypeId, matchTypeName, matchList = [], matchListStat = false }, setMatch] = useState({});

  const onOpenHandle = () => setVisible(true);
  const onCloseHandle = () => setVisible(false);
  const [{ matchId, matchName, matchTime, matchStat3 = false }, setMatch3] = useState({});

  useImperativeHandle(ref, () => ({
    open: () => {
      if (!liveCategoryData.length) runLiveCategory(null);
      return onOpenHandle();
    },
    close: onCloseHandle
  }));

  const goBalck = () => {
    setMatch({
      matchListStat: false
    });
    setMatch3({ matchId: null });
  };

  const selectClick = () => {
    if (matchStat3 === false) {
      setMessage('请选择比赛');
      setSnackbar({ ...snackbar, open: true });
      return false;
    }

    onCloseHandle();
    setMatch({
      matchListStat: false
    });
    setMatch3({ matchStat3: false });

    return onChange({
      liveTypeId,
      liveTypeName,
      matchTypeId,
      matchTypeName,
      match_id: matchId,
      matchName,
      matchTime
    });
  };

  // 赛事输入提交
  const onEventInputSubmit = (obj) => {
    onCloseHandle();
    return onChange({
      liveTypeId,
      liveTypeName,
      matchTypeId: null,
      matchTypeName: obj.matchTypeName,
      match_id: 3,
      matchName: obj.matchName,
      matchTime: obj.matchTime
    });
  };

  const inputInput = (val) => {
    setSearch({ searchVal: val, searchStat: true });
  };
  const inputBlur = () => {
    setTimeout(() => {
      setSearch({ searchStat: false });
    }, 200);
  };

  const onSeleMatchChange = (v) => {
    setSearch({ searchVal: v.matchName, searchStat: false });
    const selectArr = getArrayByLastValue(list, v.matchId, 'matchId') || [];
    if (selectArr.length !== 3) return;

    const [
      { liveTypeId, liveTypeName } = {},
      { matchTypeId, matchTypeName } = {},
      { matchId: match_id, matchName, matchTime } = {}
    ] = selectArr;

    onCloseHandle();
    return onChange({
      liveTypeId,
      liveTypeName,
      matchTypeId,
      matchTypeName,
      match_id,
      matchName,
      matchTime
    });
  };

  const newOptions = (val, arrdata) => {
    const listArr = [];
    for (let i = 0; i < arrdata.length; i++) {
      for (let j = 0; j < arrdata[i].children.length; j++) {
        for (let k = 0; k < arrdata[i].children[j].children?.length; k++) {
          if (arrdata[i].children[j].children[k].matchName.includes(val) === true) {
            listArr.push(arrdata[i].children[j].children[k]);
          }
        }

        // if(arrdata[i].children[j].matchTypeName.includes(val) === true){
        //   listArr.push(arrdata[i].children[j].children)
        // }else{

        // }
      }
    }
    return listArr;
  };

  let newArr = [];
  if (list?.length > 0 && searchVal?.length > 0) {
    const list22 = newOptions(searchVal, list);
    newArr = list22.slice(0, 8);
  }

  return (
    <Dialog
      visible={visible}
      width={848}
      onClose={onCloseHandle}
      hideBackdrop
      title={(
        <div className={styles.titlectn}>
          <p className={styles.titletext}>
            {matchListStat ? '场次选择' : '直播分类'}
          </p>
          <div className={styles.inputctn}>
            <input
              type="text"
              className={styles.input}
              placeholder="输入球队名称"
              value={searchVal || ''}
              onChange={(e) => inputInput(e.target.value)}
              onBlur={() => inputBlur()}
            />
            <span className={styles.sousou} />
            {
              searchStat
                ? <SearchSelect dataList={newArr} onChange={onSeleMatchChange} /> : null
            }

          </div>
        </div>
      )}
    >
      <div className={styles.container}>
        <div className={styles.ctn}>
          <div
            className={ClassNames(styles.tabctn, {
              [styles.isActive11]: matchListStat === false
            })}
          >
            <div className={styles.line1} />
            <ul className={styles.liveul}>
              {list.map((row, index) => (
                <li
                  className={ClassNames(styles.liveli, {
                    [styles.isActive]: liveTypeId === row.liveTypeId
                  })}
                  onClick={() => setMatchType({
                    liveTypeId: row.liveTypeId,
                    liveTypeName: row.liveTypeName,
                    matchTypeList: row.children || []
                  })}
                  key={index}
                >
                  <div>{`${row.liveTypeName}(${row.children.length})`}</div>
                  <span className={styles.liveborder} />
                </li>
              ))}
              {liveCategoryList.map((row, index) => (
                <li
                  className={ClassNames(styles.liveli, {
                    [styles.isActive]: liveTypeId === row.matchType
                  })}
                  onClick={() => setMatchType({
                    liveTypeId: row.matchType,
                    liveTypeName: row.name,
                    matchTypeList: [],
                    showInput: true
                  })}
                  key={index}
                >
                  <div>{row.name}</div>
                  <span className={styles.liveborder} />
                </li>
              ))}
            </ul>
            <div className={styles.tabmain}>
              <RenderJudge
                value={matchTypeList && matchTypeList.length}
                active={(
                  <ul className={styles.wrap}>
                    {matchTypeList?.map((row, index) => (
                      <li
                        className={ClassNames(styles.wrapli)}
                        onClick={() => setMatch({
                          matchTypeId: row.matchTypeId,
                          matchTypeName: row.matchTypeName,
                          matchList: row.children || [],
                          matchListStat: true
                        })}
                        key={index}
                      >
                        {row.matchTypeName}
                      </li>
                    ))}
                  </ul>
                )}
              />
              <RenderJudge
                value={showInput}
                active={(
                  <EventInput onClose={onCloseHandle} onSubmit={onEventInputSubmit} />
                )}
              />
            </div>
          </div>

          <div
            className={ClassNames(styles.selectwrap, {
              [styles.isActive]: matchListStat === true
            })}
          >
            <div className={styles.selecttop}>
              <p
                className={styles.blackl}
                onClick={() => {
                  goBalck();
                }}
              >
                返回
              </p>
              <p className={styles.text}>请选择比赛场次</p>
            </div>
            <div className={styles.selectmain}>
              <ul className={styles.seleul}>
                {matchList.map((row, index) => (
                  <li
                    className={ClassNames(styles.seleli, { [styles.isActive3]: matchId === row.matchId })}
                    onClick={() => setMatch3({
                      matchId: row.matchId,
                      matchName: row.matchName,
                      matchTime: row.matchTime,
                      matchStat3: true
                    })}
                    key={index}
                  >
                    <span>{timeFormat(row.matchTime)}</span>
                    <span className={styles.matchname}>{row.matchName}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.buttons}>
                <button
                  className={styles.quxiao}
                  onClick={() => {
                    goBalck();
                  }}
                >
                  取消
                </button>
                <button
                  className={ClassNames(styles.queren, { [styles.isActive]: !!matchId })}
                  onClick={selectClick}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          autoHideDuration={1000}
          onClose={() => {
            setSnackbar({ ...snackbar, open: false });
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!open}
          message={message}
          key="default"
        />
      </div>
    </Dialog>
  );
});

EventSelection.defaultProps = {
  list: [],
  onChange: empty
};

const SearchSelect = ({ dataList, onChange }) => {
  const onChangeHandle = (v) => {
    onChange(v);
  };
  return (
    <div className={styles.codeList}>
      {dataList?.length > 0
        ? dataList.map((row, index) => (
          <div
            className={ClassNames(styles.codeItem)}
            onClick={(e) => onChangeHandle(row)}
            key={index}
          >
            <div className={styles.codeLabel}>{row.matchName}</div>
          </div>
        ))
        : null}
    </div>
  );
};

SearchSelect.defaultProps = {
  onChange: empty
};

export default EventSelection;
