import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import image404 from '@/assets/images/error/404.png';
import image500 from '@/assets/images/error/500.png';

import styles from './style.scss';

const Error = ({ status, className }) => {
  const pageImage = status === 404 ? image404 : image500;

  return (
    <div className={ClassNames(styles.container, className)}>
      <img src={pageImage} alt="" className={styles.image} />
      <Link to="/" className={styles.button}>返回首页</Link>
    </div>
  );
};

Error.propTypes = {
  status: PropTypes.number
};
Error.defaultProps = {
  status: 404
};

export default Error;
