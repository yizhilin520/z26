import React, { useState, useEffect, useRef, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './style.scss'
import { ChatsContext } from '@/components/chats'
import NativeSelect from '@material-ui/core/NativeSelect'
import InputBase from '@material-ui/core/InputBase'
import history from '@/utils/history'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { RootState } from '@/reducers'
import LivePlayType from '../LivePlayType'
import { clearPleyerStyle, newDPlayer } from './function'

interface Props {
  isHiddenChat: boolean
  // [name: string]: any
  playAddr: any
  videoShotImg: string
  activeIndex: number
  [name: string]: any
}
let dp: any = null
const Player1 = (props: Props) => {
  const { playAddr, room_id, source_type } = props
  const pleyerEl: any = useRef<Element>(null)
  useEffect(() => {
    console.log('props', props)
    dp = newDPlayer()
    clearPleyerStyle(dp, pleyerEl)
  }, [])
  // }, [room_id])
  return <>
    <div id="dplayer" className={style.dplayer} ref={pleyerEl} />
    <div className={style.menu}>
      <MenuLeft />
      <MenuRight />
    </div>
  </>
}

const MenuLeft = () => {
  return <div className={style.menuLeft}>
    <span className={style.playIcon} />
    <span className={style.refreshIcon} />
    <div className={style.matchTitle}>
      <div className={style.liveGif} >
        <span className={style.gif} />
        <span className={style.textLIVE}>LIVE</span>
      </div>
      {/* <span className={style.textLiveTitle}>asdasdasdddddddddddddddddd</span> */}
    </div>
  </div>
}

const MenuRight = () => {
  return <div className={style.menuRight}>
    <div className={style.switch}>
      222222222222
   </div>
  </div>
}

export default Player1