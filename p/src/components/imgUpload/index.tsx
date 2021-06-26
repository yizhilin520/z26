import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { userAction } from '@/actions';

import Snackbar from '@material-ui/core/Snackbar';

import uploadI from './upimg.scss'

interface Props1 {
  url: string;
  getDataUrl:any
}
{/* <ImgUpload url='/live-passport-api/upload/image' getDataUrl={getData}/> */}

export default  function ImgUpload (props:Props1) {
  const {getDataUrl} = props;
  // console.log(props.url)
  let accepts = ['image/jpeg', 'image/jpg', 'image/png']

  // 从后台返回的img路径,  dataUrl
  const [defaultProp, setDefaultProp] = useState({
    dataUrl:'',
    isPreview: false,
    imgFile:'',
    imgSrcBd:''

  })

  // 返回的数据
  const [uploadData, setUploadData] = useState('')
  // console.log(uploadData)

// 弹框提醒消息
const [msgskbar, setMsgskbar] = useState('');
const [snackbar, setSnackbar] = useState({
  open: false,
  vertical: 'top',
  horizontal: 'center'
});
const { vertical, horizontal, open } = snackbar;


  useEffect(() => {
    if(uploadData){
      Preview()
    }
  }, [uploadData]);

  const handleUpdate = (event:any) =>{
    let fileImg =event.target.files[0];
    console.log(fileImg)

    defaultProp.imgFile = fileImg
    setDefaultProp({...defaultProp})
    Accepts(fileImg)

  }
  // 图片格式限定
  const Accepts = (files:any) => {
    if(!files){
      return false
    }

    // console.log(accepts)
    let type = Array.isArray(accepts) && accepts.indexOf(files.type,0)

    if(type >= 0){
      if (files.size > 2097152) {
        setMsgskbar("上传的文件不能大于2M")
        setSnackbar({ ...snackbar, open: true })
         return;
      }else{
 　　　　sedUpload(files)
　　　　}
   }else{
    setMsgskbar("请上传格式为jpg、png，jpeg的图片")
    setSnackbar({ ...snackbar, open: true })
   }

  }

  // 本地预览
  const Preview = () =>{
    // 设置本地查看图片路径
    const file:any = defaultProp.imgFile;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      // console.log(this.result)
      setDefaultProp({imgSrcBd: this.result })
    }

  }

  const sedUpload = (filess:any) => {
    let formData = new FormData()
    formData.append("file", filess); // 上传的文件： 键名，键值

    var url = `${process.env.LIVE_PASSPORT_API}/upload/image`;//接口
    url = url ? url : '';
    var XHR: any = null;
    if (window.XMLHttpRequest) {
        // 非IE内核
        XHR = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // IE内核，这里早期IE版本不同，具体可以查下
        XHR = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        XHR = null;
    }
    if (XHR) {
        XHR.open("POST", url);
        // XHR.setRequestHeader("Content-Type","multipart/form-data");
        XHR.onreadystatechange = function() {
            if (XHR.readyState == 4 && XHR.status == 200) {
                var resultValue = XHR.responseText;
                var data = JSON.parse(resultValue);
                XHR = null;
                console.log('图片',data)
                setUploadData({...data})
                getDataUrl(data.data)
            }
        }
        XHR.send(formData);
    }

  }

  return(
      <div className={uploadI.ctn}>
        <form id="myForm" action="" method="post" encType="multipart/form-data">
          <input type="file" onChange={(event) =>handleUpdate(event)} />
          {/* <div className={uploadI.dianji}><span>+</span><p className={uploadI.text}>点击上传</p></div> */}
        </form>
        <div className={uploadI.imgContent}>
            {defaultProp.imgSrcBd ? <img src={defaultProp.imgSrcBd} /> : ''}
        </div>
        <Snackbar
        autoHideDuration={1000}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false });
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        message={msgskbar}
        key={'default'}
      />
      </div>
  )
}