import { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { empty } from '@/utils/common';
import { useWebsocketPush } from '@/utils/hooks';

const WebsocketPush = forwardRef(({ path, on, children }, ref) => {
  const socket = useWebsocketPush(path, on);

  useImperativeHandle(ref, () => socket);

  return children;
});

WebsocketPush.propTypes = {
  path: PropTypes.string.isRequired,
  on: PropTypes.objectOf(PropTypes.func)
};

WebsocketPush.defaultProps = {
  on: {
    message: empty
  }
};

export default WebsocketPush;
