import React, { Component } from 'react';
import { Button, message } from 'antd';
import HttpRequest from '@/requset/Fetch';
let timer;

class GetCode extends Component {
  state = {
    verificationText: "获取动态验证码",
    countdown: 60, // 60倒计时
    verificationButtonDisabled: false, // 验证码按钮状态
  }

  componentWillUnmount () {
    clearInterval(timer);
  }

  // 请求验证码
  getCode = () => {
    const { account, type, areaCode } = this.props;
    let str, api, zh;

    if (type === 'phone') {
      str = '手机号';
      api = 'getCodeRegister';
      zh = (areaCode ? areaCode : '') + account;
    } else {
      str = '帐号';
      api = 'getCode';
      zh = account;
    }

    if (!account) {
      message.warning(`请填写${str}！`)
    } else {
      HttpRequest(`/code/${api}`, "POST", {
        account: zh
      }, res => {
        message.success('发送成功！')
        this.getVerification()
      })
    }
  }

  // 获取验证
  getVerification = () => {
    timer = setInterval(() => {
      let countdown = JSON.parse(JSON.stringify(this.state.countdown));

      if (countdown === 0) {
        clearInterval(timer);

        this.setState({
          verificationText: "获取动态验证码",
          verificationButtonDisabled: false,
          countdown: 60
        })
      } else {
        --countdown;

        this.setState({
          verificationText: `${ countdown } s`,
          verificationButtonDisabled: true,
          countdown
        })
      }
    }, 1000)
  }

  render () {
    return (
      <Button onClick={ this.getCode } className="pull-right" style={{ position: "relative", zIndex: "100", width: "35%", height: 40 , padding: 0, color: "#333" }} disabled={this.state.verificationButtonDisabled}>{ this.state.verificationText }</Button>
    )
  }
}

export default GetCode;