import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GraphCode = ({ code, width, height, ...props }) => {
  const containerRef = useRef();

  // 根据最小值和最大值之间获取随机数
  const rn = (min, max) => parseInt(Math.random() * (max - min) + min, 10);
  // 获取随机颜色
  const rc = (min, max) => {
    const r = rn(min, max);
    const g = rn(min, max);
    const b = rn(min, max);
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    if (!code) return;

    const codeLen = code.length;
    const ctx = containerRef.current.getContext('2d');
    ctx.fillStyle = rc(250, 255);
    ctx.fillRect(0, 0, width, height);
    // 随机产生字符串
    for (let i = 0; i < codeLen; i += 1) {
      const c = code[i];// 随机的字
      const fs = rn(24, 40);// 字体的大小
      const deg = rn(-30, 30);// 字体的旋转角度
      ctx.font = `${fs}px Simhei`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = rc(85, 150);
      ctx.save();
      ctx.translate(30 * i + 15, 15);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillText(c, -15 + 5, -15);
      ctx.restore();
    }
    // 随机产生干扰线,干扰线的颜色要浅一点
    for (let i = 0; i < codeLen + 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(rn(0, width), rn(0, height));
      ctx.lineTo(rn(0, width), rn(0, height));
      ctx.strokeStyle = rc(220, 230);
      ctx.closePath();
      ctx.stroke();
    }
    // 随机产生干扰的小点
    for (let i = 0; i < codeLen * 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rn(0, width), rn(0, height), 1, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = rc(150, 200);
      ctx.fill();
    }
  }, [code]);

  return (
    <canvas width={width} height={height} ref={containerRef} {...props} />
  );
};

GraphCode.propTypes = {
  code: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

GraphCode.defaultProps = {
  width: 120,
  height: 40
};

export default GraphCode;
