import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

// 样式
import 'normalize.css';
import '@/assets/scss/main.scss';

ReactDom.render(<App />, document.getElementById('app-main'));
