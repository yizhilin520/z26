


import React, { useEffect, useRef } from 'react'
import Switch from '@material-ui/core/Switch'
import Paper from '@material-ui/core/Paper'
import Slide from '@material-ui/core/Slide'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import style from './style.scss'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 180,
    },
    wrapper: {
      width: 100 + theme.spacing(2),
    },
    paper: {
      zIndex: 1,
      position: 'relative',
      margin: theme.spacing(1),
    },
    svg: {
      width: 100,
      height: 100,
    },
    polygon: {
      fill: theme.palette.common.white,
      stroke: theme.palette.divider,
      strokeWidth: 1,
    },
  }),
)


export default function SimpleSlide(props: any) {
  const { isShowSlide, setIsShowSlide } = props
  const classes = useStyles()
  return (
    <div style={{ width: '60%', position: 'absolute', right: '0' }}>
      <div>
        <div className={classes.wrapper} onClick={() => setIsShowSlide(!isShowSlide)}>
          <Slide direction="left" in={isShowSlide} mountOnEnter unmountOnExit>
            <div className={style.grad}>
              <span>全局通知: 用户川崎充值了999元大礼包 ! ! !</span>
            </div>
          </Slide>
        </div>
      </div>
    </div>
  )
}