
import React from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import './tabsret.css'

const AntTabs = withStyles({
  indicator: {
    backgroundImage: 'linear-gradient(to right, #83c8ff, #3977fe), linear-gradient(to bottom, #eeeeee, #d8d8d8)',
  },
})(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 30,
      padding:0,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: 66,
      fontSize: 18,
      color: '#999999',
      backgroundColor: '#fff',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        // maskImage: '-webkit-gradient(linear, 0 0, 0 bottom, from(#ff0000), to(rgba(0, 0, 255, 0)))',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
      },
    },
    selected: {},
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />)


interface StyledTabProps {
  label: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: 4,
  },

  demo1: {
    backgroundColor: '#fff',
    borderRadius: 4,
  },

}));

const ComponTabs = (props: any) => {


  const classes = useStyles();
  const { index, setIndex, titles, ...p } = props
  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs value={index} aria-label="ant example" {...p}>
          {titles.map((title: string, index: number) => (
            <AntTab label={title} key={index} onClick={() => setIndex(index)} />
            ))}
        </AntTabs>
      </div>
    </div>
  );
}

export default ComponTabs