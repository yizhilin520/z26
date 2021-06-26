import React, { useState, useEffect, useReducer, createContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import history from '@/utils/history'
import Grid from '@material-ui/core/Grid'
import style from './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { homeAction, userAction } from '@/actions'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { RootState } from '@/reducers'
import { generateMsgId } from '@/utils/common'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    selectWidth: {
      margin: theme.spacing(1),
      minWidth: '88px',
    },
  }),
)

export default function BearCard(props: any) {
  const { room_id } = props
  const dispatch = useDispatch()
  const [isShowUser, setIsShowUser] = useState<any>(false)
  const [isShowStop, setIsShowStop] = useState<any>(false)
  const [isShowTime, setIsShowTime] = useState<any>(false)
  const [isManage, setIsManage] = useState<any>(false)


  // 
  useEffect(() => {
    if (props?.userId) {
      setIsShowUser(!isShowUser)
      // 查看点击的用户是不是房管或者主播
      dispatch({
        type: `home/${homeAction.GET_CHAT_USER_STATE}`,
        payload: { room_id },
        callback: (res: any) => {
          if (res.code === 200) setIsManage(res?.data?.isManage)
        }
      })
    }
  }, [props?.userId])
  // useEffect(() => {
  //   console.log(props?.randomstr)
  //   if (props?.userId && !isShowUser) {
  //     setIsShowUser(true)
  //   }
  // }, [props?.randomstr])

  return (
    <div className={style.root}>
      {
        isShowUser &&
        <BearUser{...{
          ...props,
          isManage,
          onCloseUser: () => setIsShowUser(!isShowUser),
          onCloseStop: () => setIsShowStop(!isShowStop)
        }}
        />
      }
      {
        isShowStop &&
        <BearStop {...{
          ...props,
          isManage,
          onCloseUser: () => setIsShowUser(!isShowUser),
          onCloseStop: () => setIsShowStop(!isShowStop),
          onCloseTime: () => setIsShowTime(!isShowTime)
        }} />
      }
      {
        isShowTime &&
        <BearTime {...{
          ...props,
          isManage,
          onCloseTime: () => setIsShowTime(!isShowTime)
        }} />
      }
    </div>

  )
}

function BearUser(props: any) {

  const { nickname, fans, room_id, headImage, level, onCloseUser, onCloseStop, isManage, account, userId: uid } = props

  return (
    <div className={style.usercontainer}>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <div className={`${style.content} ${style.userContent}`}>
              <div className={style.close} onClick={onCloseUser}>X</div>
              <div className={style.user}>
                <img src={headImage} alt="" />
              </div>
              <div className={style.title}>{nickname}</div>
              <div className={style.tip}><i>LV {level}</i></div>
              <div className={style.number}>粉丝: {fans}</div>
            </div>
            {/* 如果是用户本人 */}
            {!isManage
              &&
              <div className={style.buttons}>
                <div className={style.ifself} onClick={() => history.push('/user')}>查看主页</div>
              </div>
              ||
              <div className={style.buttons}>
                <div className={style.btn}>主页</div>
                <div className={style.btn}>关注</div>
                <div className={style.btn} onClick={() => {
                  onCloseUser()
                  onCloseStop()
                }}>禁言</div>
              </div>
            }
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

function BearTime(props: any) {
  const { nickname, fans, headImage, level, onCloseTime } = props
  console.log('props', props);
  return (
    <div className={style.container}>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <div className={style.content}>
              <span>{nickname}已被禁言至</span>
              <span className={style.red}>2020-11-24</span>
            </div>
            <div className={style.footer} onClick={onCloseTime}>确定</div>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}


function BearStop(props: any) {

  const {
    nickname, fans, headImage, level, onCloseUser,
    onCloseStop, onCloseTime, account, room_id, userId: uid,
  } = props

  const [forbidTimeType, setForbidTimeType] = useState<number>(1)
  const [violateType, setViolateType] = useState<number>(1)
  const dispatch = useDispatch()

  const [dictionary, setDictionary] = useState<any>(Object.create(null))
  const classes = useStyles()

  const _getDictionary = () => {
    dispatch({
      type: `home/${homeAction.GET_DICTIONARY}`,
      callback: (res: any) => {
        if (res.code === 200) {
          setDictionary({ ...res.data })
        }
      }
    })
  }
  useEffect(() => {
    _getDictionary()
  }, [])



  // 确定禁言
  const _forbiddenSpeech = () => {
    console.log('_forbiddenSpeech', _forbiddenSpeech);

    dispatch({
      type: `user/${userAction.GET_SHUTUPFORBIDSENDMSG_EPIC}`,
      payload: { room_id, uid, forbidTimeType, violateType },
      callback: (res: any) => {
        console.log('-确定禁言按钮res->', res);
        if (res.code === 200) {
          onCloseStop()
          onCloseTime()
        }
      }
    })
  }
  const menuProps = {
    classes: {
      // paper: minimalSelectClasses.paper,
      // list: minimalSelectClasses.list
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    getContentAnchorEl: null
  }

  return (
    <div className={style.container}>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <div className={`${style.content} ${style.stopContent}`}>
              <div className={style.title}>将 {nickname} 禁言</div>
              <div className={style.input}>
                <div className={style.left}>*禁言时长</div>
                <div className={style.right}>
                  <Select
                    disableUnderline
                    // classes={{ root: minimalSelectClasses.select }}
                    MenuProps={menuProps}
                    className={classes.selectWidth}
                    // IconComponent={iconComponent}
                    value={forbidTimeType}
                    onChange={(e: any) => setForbidTimeType(e?.target?.value)}
                  >
                    {
                      dictionary?.forbbidTimeList?.map((item: any) => <MenuItem key={item?.value} value={item?.value}>{item?.desc}</MenuItem>)
                    }
                  </Select>
                </div>
              </div>
              <div className={style.input}>
                <div className={style.left}>*违规类型</div>
                <div className={style.right}>
                  <Select
                    disableUnderline
                    // classes={{ root: minimalSelectClasses.select }}
                    MenuProps={menuProps}
                    className={classes.selectWidth}
                    // IconComponent={iconComponent}
                    value={violateType}
                    onChange={(e: any) => setViolateType(e?.target?.value)}
                  >
                    {
                      dictionary?.violateTypeList?.map((item: any) => <MenuItem key={item?.value} value={item?.value}>{item?.desc}</MenuItem>)
                    }
                  </Select>
                </div>
              </div>
            </div>
            <div className={`${style.buttons} ${style.stopButtons}`}>
              <div className={style.btn} onClick={() => {
                onCloseStop()
                onCloseUser()
              }}>取消禁言</div>
              <div className={style.btn} onClick={() => {
                _forbiddenSpeech()
              }}>确定禁言</div>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}