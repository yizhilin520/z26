import React, { useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SVGA from 'svgaplayerweb'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: 'red',
    },
  }),
)

export default function SimpleBackdrop() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  const player = () => {
    var player = new SVGA.Player('#demoCanvas');
    var parser = new SVGA.Parser(); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
    parser.load('http://www.doudong888.com/cloud-ulive-test/IMAGES/svg/loading.svga', function (videoItem) {
      player.setVideoItem(videoItem);
      player.startAnimation();
    })
  }
  useEffect(() => {
    // player()
  }, [])

  return (
    <div>
      <Backdrop style={{ backgroundColor: 'hsla(1,0%,100%,.9)' }} className={classes.backdrop} open={open} onClick={handleClose}>
        {/* <CircularProgress color="inherit" /> */}
        <div id="demoCanvas"></div>
      </Backdrop>
    </div>
  );
}
