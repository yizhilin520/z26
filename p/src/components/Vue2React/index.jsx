import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useVueComponent } from '@/utils/hooks';

const Vue2React = forwardRef(({ className, style, component, ...props }, ref) => {
  const containerRef = useRef();

  const instance = useVueComponent(containerRef, component, props);

  useImperativeHandle(ref, () => instance);

  return (<div ref={containerRef} className={className} style={style} />);
});

export default Vue2React;
