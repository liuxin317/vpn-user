import React, { Component } from "react";
import { Form, Input, Button, Icon, message } from 'antd';
import GetCode from '../common/getCode';
import HttpRequest from '@/requset/Fetch';
import { Link, Redirect } from 'react-router-dom';
import "./style.scss";

const FormItem = Form.Item;

class RetrievalPw extends Component {
  state = {
    account: '', // 帐号
    code: '', // 验证码
    redirect: false, // 跳转状态
  }

  // 提交验证
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        HttpRequest("/code/verifyCode", "POST", {
          ...values
        }, res => {
          message.success('修改成功！')

          setTimeout(() => {
            this.setState({
              redirect: true
            })
          }, 600)
        })
      }
    })
  }

  // 监听Input
  onChangeInput = (name, e) => {
    let obj = {};
    obj[name] = e.target.value;

    this.setState({
      ...obj
    })
  }

  // 获取验证码
  getAccountCode = (code) => {
    this.setState({
      code
    })
  }

  render () {
    const { account, redirect } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (redirect) {
      return <Redirect push to="/" />
    }

    return (
      <section className="retrieval-box">
        <div className="register-content">
          <h2>找回密码</h2>

          <div className="retrieval-frame">
            <Form onSubmit={this.handleSubmit} className="inputs-group">
              <FormItem
                label="登录帐号"
              >
                {getFieldDecorator('account', {
                  rules: [{
                    required: true, message: '请填写帐号',
                  }],
                })(
                  <Input onChange={this.onChangeInput.bind(this, 'account')} />
                )}
              </FormItem>

              <FormItem
                label="验证码"
              >
                <div className="pull-left" style={{ width: "63%" }}>
                  {getFieldDecorator('verifyCode', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(
                    <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                  )}
                </div>
                <GetCode account={account} getAccountCode={this.getAccountCode} />
                <div className="clear"></div>
              </FormItem>

              <FormItem
                label="新密码"
              >
                {getFieldDecorator('newPassword', {
                  rules: [{
                    required: true, message: '请填写注册密码',
                  }, {
                    validator: this.validateToNextPassword,
                  }],
                })(
                  <Input type="password" />
                )}
              </FormItem>

              <div style={{ marginBottom: 20 }}>
                <div className="pull-right">
                  <Link to="/">返回登录</Link>
                </div>
                <div className="clear"></div>
              </div>

              <FormItem>
                <Button className="submit-btn" type="primary" htmlType="submit">找回密码</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </section>
    )
  }
}

const WrappedRegistrationForm = Form.create()(RetrievalPw);

export default WrappedRegistrationForm;