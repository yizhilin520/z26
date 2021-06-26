import React, { useState, useEffect, useRef } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Cropper1: React.FC = () => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    console.log(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <Cropper
      src="https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"
      style={{ height: 330, width: "100%" }}
      // Cropper.js options
      initialAspectRatio={16 / 9}
      guides={false}
      crop={onCrop}
      ref={cropperRef}
    />
  );
}

export default Cropper1