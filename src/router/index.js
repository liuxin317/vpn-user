import React, { Component } from 'react';
import PreLoading from '../components/common/Preloading';
import loadable from 'react-loadable'; // 代码的拆分和懒加载
import {Route} from 'react-router-dom';

// 登录页面
const loadLogin = loadable({
  loader: () => import('../components/login'),
  loading: PreLoading
})

// 注册页面
const loadRegidter = loadable({
  loader: () => import('../components/register'),
  loading: PreLoading
})

// 用户信息页面
const loadUserInfo = loadable({
  loader: () => import('../components/userInfo'),
  loading: PreLoading
})

// 找回密码
const RetrievalPw = loadable({
  loader: () => import('../components/retrievalPw'),
  loading: PreLoading
})

class ViewRoute extends Component {
  render () {
    return (
      <section>
        <Route path="/" component={ loadLogin } exact />
        <Route path="/register" component={ loadRegidter } />
        <Route path="/info" component={ loadUserInfo } />
        <Route path="/retrieval-pw" component={ RetrievalPw } />
      </section>
    )
  }
}

export default ViewRoute;