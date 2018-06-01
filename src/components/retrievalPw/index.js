import React, { Component } from "react";
import { Form, Input, Button, Icon, message, Radio, Select, Tooltip } from 'antd';
import GetCode from '../common/getCode';
import HttpRequest from '@/requset/Fetch';
import countryCode from '@/configure/countryCode';
import { Link, Redirect } from 'react-router-dom';
import "./style.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class RetrievalPw extends Component {
  state = {
    account: '', // 帐号
    code: '', // 验证码
    redirect: false, // 跳转状态
    accountType: 1, // 帐号类别，1、邮箱，2、手机
    areaCode: '+86', // 区号
  }

  // 提交验证
  handleSubmit = (e) => {
    e.preventDefault();
    const { areaCode, accountType } = this.state;
    
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { verifyCode, account, newPassword } = values;

      if (!err) {
        HttpRequest("/code/verifyCode", "POST", {
          verifyCode,
          account: accountType === 1 ? account : areaCode + account,
          newPassword
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

  // 监听手机区号
  onChangeSelected = (value, options) => {
    console.log(options.props.item.nationalPhoneCode)
    this.setState({
      areaCode: options.props.item.nationalPhoneCode
    })
  }

  render () {
    const { account, redirect, accountType, areaCode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'China +86',
    })(
      <Select onChange={this.onChangeSelected} style={{ maxWidth: 180, padding: '0 20px' }}>
        {
          countryCode.map((item, index) => {
            return <Option value={item.name} item={item} key={index}><Tooltip title={ item.name + ' ' + item.nationalPhoneCode }>{ item.name + ' ' + item.nationalPhoneCode }</Tooltip></Option>
          })
        }
      </Select>
    );

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
                <RadioGroup onChange={this.onChangeInput.bind(this, 'accountType')} value={accountType}>
                  <Radio value={1}>邮箱</Radio>
                  <Radio value={2}>手机号</Radio>
                </RadioGroup>

                {getFieldDecorator('account', {
                  rules: [{
                    required: true, message: '请填写帐号',
                  }],
                })(
                  <Input addonBefore={accountType === 2 ? prefixSelector : null} onChange={this.onChangeInput.bind(this, 'account')} />
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
                <GetCode account={account} type={accountType === 2 ? 'phone' : ''} areaCode={areaCode}  />
                <div className="clear"></div>
              </FormItem>

              <FormItem
                label="新密码"
              >
                {getFieldDecorator('newPassword', {
                  rules: [{
                    required: true, message: '请填写新密码',
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