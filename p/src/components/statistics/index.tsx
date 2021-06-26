import React, { createContext, useReducer, useEffect, useState } from 'react';
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { RootState } from '@/reducers';
import style from './style.scss';
import LinearProgress, {
  LinearProgressProps
} from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 8,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: '#414141'
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#ffca43'
    }
  })
)(LinearProgress);
const BorderLinearProgressKd = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 8,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: '#414141'
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#8192c9'
    }
  })
)(LinearProgress);
const Progress = (props: any = {}) => {
  const [progress, setProgress] = React.useState(50);
  return (
    <div className={style.progress}>
      <Typography variant='body2'>{props?.type ? `${props?.data[0] || 0}%` : props?.data[0]}</Typography>
      <div className={style.left}>
        <BorderLinearProgress variant='determinate' value={props?.data[0] || 0} />
      </div>
      <span>{props?.label}</span>
      <div className={`${style.left} ${style.kd}`}>
        <BorderLinearProgressKd variant='determinate' value={props?.data[1] || 0} />
      </div>
      <Typography variant='body2'>{props?.type ? `${props?.data[1] || 0}%` : props?.data[1]}</Typography>
    </div>
  );
};
export default function Statistics(props: any) {
  const getAppRealtime = useSelector(
    (state: RootState) => state.score['getAppRealtime']
  );
  let statistics: any = getAppRealtime[0];
  if (!statistics) statistics = [];
  const kql = [statistics[10], statistics[11]];
  const jg = [statistics[18], statistics[19]];
  const wxjg = [statistics[12], statistics[13]];
  const spqm = [statistics[16], statistics[17]];
  const szqm = [statistics[14], statistics[15]];
  // const inquireArr: ($arr: any) => boolean = (arr) => {
  //   let i = 0
  //   while (i < arr.length) {
  //     if (arr[i] === undefined) return false
  //     i++
  //   }
  //   return true
  // }
  // if (!inquireArr([...kql, ...jg, ...wxjg, ...spqm, ...szqm])) return <></>
  return (
    <div className={style.container}>
      <div className={style.top}>
        <div className={style.box}>
          <i className={style.qizi}></i>
          <span>{statistics[8]}</span>
        </div>
        <div className={style.box}>
          <i className={style.yellow}></i>
          <span>{statistics[6]}</span>
        </div>
        <div className={style.box}>
          <i className={style.red}></i>
          <span>{statistics[4]}</span>
        </div>
        {Progress({ label: '控球率', data: kql, type: true })}
        <div className={style.box}>
          <i className={style.red}></i>
          <span>{statistics[5]}</span>
        </div>
        <div className={style.box}>
          <i className={style.yellow}></i>
          <span>{statistics[7]}</span>
        </div>
        <div className={style.box}>
          <i className={style.qizi}></i>
          <span>{statistics[9]}</span>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.left}>
          {Progress({ label: '进攻', data: jg })}
        </div>
        <div className={style.right}>
          {Progress({ label: '射正球门', data: szqm })}
        </div>
      </div>
      <div className={style.content}>
        <div className={style.left}>
          {Progress({ label: '危险进攻', data: wxjg })}
        </div>
        <div className={style.right}>
          {Progress({ label: '射偏球门', data: spqm })}
        </div>
      </div>
    </div>
  );
}
