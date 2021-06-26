import React, { useState, useEffect } from 'react';
import './dropdown.css';

// 使用方法 父组件传值 dataSelect
{
  /* <Selectes dataSelect={data} listClickIndex={listClick1}/> */
}
interface Props {
  dataSelect: Array<string>;
  listClickIndex:any
}

export default function Dropdown1(props: Props) {
  const {listClickIndex} = props;
  let dataSelect: any[];
  // console.log(props.dataSelect)
  dataSelect = props.dataSelect;

  const [dropDown, setDropDown] = useState(false);
  const [pList, setpList] = useState(dataSelect[0]);
  // const list = ['第1条', '第2条', '第3条', '第4条'];

  const handleClick = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setDropDown(!dropDown);
  };
  const listClick = (index2: number) => {
    // console.log(index2);
    const list2 = [...dataSelect];
    const listx = list2.filter((item, index) => {
      return index === index2
    });
    setpList(listx);
    setDropDown(!dropDown);
    listClickIndex(index2) // 向父组件传值
  };

  const widonclick = () => {
    setDropDown(false);
  };
  useEffect(() => {
    window.addEventListener('click', widonclick);
    return () => {
      window.removeEventListener('click', widonclick);
    };
  }, []);

  return (
    <div className={`dropdownlist ${dropDown ? 'show1' : ''}`}>
      <div className='drop-text' onClick={handleClick}>
        <p className='drop-value'>{pList}</p>
        <span className='drop-icon'></span>
      </div>
      <ul className={`dropUl ${dropDown ? 'in' : ''}`}>
        {dataSelect.length > 0 &&
          dataSelect.map((item, index) => {
            return (
              <li key={index} onClick={e => listClick(index)}>
                {item}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
