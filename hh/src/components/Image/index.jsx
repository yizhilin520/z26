import React, { useEffect } from 'react';
import useSafeState from 'ahooks/lib/useSafeState';

const Image = ({ className, src, defaultImage, ...props }) => {
  const [loadFlag, setLoadFlag] = useSafeState(false);
  const [imageSrc, setImageSrc] = useSafeState(src || defaultImage);

  const onImageErrorHandle = () => {
    if (!loadFlag) {
      setImageSrc(defaultImage);
      setLoadFlag(true);
    }
  };

  useEffect(() => {
    if (src) {
      setImageSrc(src);
      setLoadFlag(false);
    }
  }, [src]);

  return (
    <img
      onError={onImageErrorHandle}
      className={className}
      src={imageSrc}
      {...props}
    />
  );
};

export default Image;
