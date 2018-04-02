import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrappedNormalLoginForm from './component/WrappedNormalLoginForm';
import "./style.scss";

class Login extends Component {
  state = {
    loginMode: [ // 登录方式
      {
        name: "账户密码登录",
        status: true,
        id: 0
      },
      {
        name: "邮箱登录",
        status: false,
        id: 1
      },
      {
        name: "手机号登录",
        status: false,
        id: 2
      }
    ],
    newloginStatus: 0, // 当前处于什么登录方式
  }

  handleModeAction = (rowData) => {
    let loginMode = this.state.loginMode;
    let newloginStatus;

    loginMode.forEach(item => {
      if (rowData.name === item.name) {
        item.status = true;
        newloginStatus = item.id
      } else {
        item.status = false;
      }
    })

    this.setState({
      newloginStatus,
      loginMode
    })

    this.props.clearInitData();
  }

  render () {
    const { loginMode } = this.state;

    return (
      <section className="login-box">
        <div className="login-content">
          <div className="login-title">
            <span className="pull-left">用户登录</span>
            <div className="clear"></div>
          </div>

          <div className="login-mode">
            <ul className="list-inline mode-group">
              {
                loginMode.map((item, index) => {
                  return (
                    <li key={ index } className={ item.status ? "active" : "" } onClick={ this.handleModeAction.bind(this, item) }>
                      { item.name }
                    </li>
                  )
                })
              }
              <div className="clear"></div>
            </ul>
          </div>

          <div className="login-from">
            <WrappedNormalLoginForm newloginStatus={ this.state.newloginStatus } />
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    clearInitData: store.common.clearInitData
  }
}

const ConnectLogin = connect(
  mapStateToProps
)(Login);

export default ConnectLogin;