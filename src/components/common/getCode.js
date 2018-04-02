import React, { Component } from 'react';
import { Button } from 'antd';
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
      <Button onClick={ this.getVerification } className="pull-right" style={{ position: "relative", zIndex: "100", width: "35%", height: 40 , padding: 0, color: "#333" }} disabled={this.state.verificationButtonDisabled}>{ this.state.verificationText }</Button>
    )
  }
}

export default GetCode;