import React from 'react';
// import { useBorderSelectStyles } from '@mui-treasury/styles/select/border';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

import './style.css';

const BootstrapInput = withStyles(theme => ({
  root: {},
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'solid 0.5px #8b8b8a',
    fontSize: 12,
    color: '#8b8b8a',
    padding: '5px 6px 5px 6px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: ['Arial', 'sans-serif'].join(','),
    '&:focus': {
      borderRadius: 4
    }
  }
}))(InputBase);

// 使用方法 父组件传值 dataSelect
{
  /* <Selectes dataSelect={data}/> */
}

interface Props {
  dataSelect: Array;
}
export default function Selectes(props: Props) {
  let dataSelect;
  // console.log(props.dataSelect)
  if (props) {
    dataSelect = props.dataSelect;
  }

  const [age, setAge] = React.useState(0);
  const handleChange = event => {
    setAge(event.target.value);
  };

  const menuProps = {
    classes: {
      // list: borderSelectClasses.list
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left'
    },
    getContentAnchorEl: null
  };

  return (
    <div>
      <FormControl>
        <Select
          labelId='inputLabel'
          id='demo-customized-select'
          autoWidth
          MenuProps={menuProps}
          value={age}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          {dataSelect.map((item, index) => {
            return (
              <MenuItem value={index} key={index}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
