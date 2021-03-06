import React, { Component } from "react";
import "./style.scss";
import { Form, Input, Select, Icon, Checkbox, Button, message, Tooltip } from 'antd';
import HttpRequest from '../../requset/Fetch';
import { Link } from 'react-router-dom';
import GetCode from '../common/getCode';
import countryCode from '@/configure/countryCode';

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends Component {
  state = {
    registerType: [{
      name: "普通账号注册",
      active: true,
      id: 0
    },{
      name: "邮箱注册",
      active: false,
      id: 1
    },{
      name: "手机号注册",
      active: false,
      id: 2
    }],
    newRegisterId: 0, // 当前注册类型id
    checked: true, // 是否同注册协议;
    phone: '', // 手机号
    areaCode: '+86', // 区号
  }

  // 切换菜单
  switchNavbar = (rowData) => {
    let { registerType } = this.state;
    let newRegisterId;

    registerType.forEach(item => {
      if (item.name === rowData.name) {
        item.active = true;
        newRegisterId = item.id;
      } else {
        item.active = false;
      }
    })

    this.setState({
      registerType,
      newRegisterId
    })
  }

  // 提交验证
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { newRegisterId, checked, areaCode } = this.state;
        const { email, account, phone, code, password, password_01, password_02 } = values;
        let compoundPassWord;

        if (password) {
          compoundPassWord = password;
        }

        if (password_01) {
          compoundPassWord = password_01;
        }

        if (password_02) {
          compoundPassWord = password_02;
        }

        if (!checked) {
          message.warning('请勾选注册协议！');

          return false;
        }

        if (Number(newRegisterId) === 2) { // 验证手机号
          let filterPhone = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
          if (!filterPhone.test(phone)) {
            message.warning('手机格式不正确！');
            return false;
          }
        }

        HttpRequest("/user/register", "POST", {
          type: newRegisterId,
          email,
          account,
          phone: phone ? (areaCode + phone) : '',
          code,
          password: compoundPassWord
        }, res => {
          message.success('注册成功, 前往登录！');

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        })
      }
    });
  }

  // 监听多选框
  onChangeCheck = (e) => {
    let checked = e.target.checked;

    this.setState({
      checked
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
    const { registerType, newRegisterId, phone, areaCode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'China +86',
    })(
      <Select onChange={this.onChangeSelected} style={{ minWidth: 150 }}>
        {
          countryCode.map((item, index) => {
            return <Option value={item.name} item={item} key={index}><Tooltip title={ item.name + ' ' + item.nationalPhoneCode }>{ item.name + ' ' + item.nationalPhoneCode }</Tooltip></Option>
          })
        }
      </Select>
    );

    let RegisterInputGroup;

    if (newRegisterId === 0) { // 普通帐号注册;
      RegisterInputGroup = (
        <div>
          <FormItem
            label="注册帐号"
          >
            {getFieldDecorator('account', {
              rules: [{
                required: true, message: '请填写注册帐号',
              },{
                min: 6, max: 100, message: '长度必须6位以上',
              }],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            label="注册密码"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请填写注册密码',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
        </div>
      )
    } else if (newRegisterId === 1) { // 邮箱注册;
      RegisterInputGroup = (
        <div>
          <FormItem
            label="注册邮箱"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: '请输入正确格式的邮箱',
              }, {
                required: true, message: '请填写邮箱',
              }],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            label="注册密码"
          >
            {getFieldDecorator('password_01', {
              rules: [{
                required: true, message: '请填写注册密码',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
        </div>
      )
    } else { // 手机号注册;
      RegisterInputGroup = (<div>
        <FormItem
          label="注册手机号"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请填写手机号' }],
          })(
            <Input onChange={this.onChangeInput.bind(this, 'phone')} addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
            label="注册密码"
          >
            {getFieldDecorator('password_02', {
              rules: [{
                required: true, message: '请填写注册密码',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>

        <FormItem
          label="验证码"
        >
          <div className="pull-left" style={{ width: "63%" }}>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '请输入验证码!' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            )}
          </div>
          <GetCode account={phone} areaCode={areaCode} type="phone" />
          <div className="clear"></div>
        </FormItem>
      </div>)
    }

    return (
      <section className="register-box">
        <div className="register-content">
          <h2>用户注册</h2>

          <div className="register-group">
            <ul className="nav-table">
              {
                registerType.map((item, index) => {
                  return (
                    <li key={ index } className={ item.active ? "active" : "" } onClick={ this.switchNavbar.bind(this, item) }>
                      { item.name }
                    </li>
                  )
                })
              }
            </ul>

            <div className="register-inputs">
              <Form onSubmit={this.handleSubmit}>
                {
                  RegisterInputGroup
                }
                
                <div style={{ lineHeight: "39px" }}>
                  <FormItem className="pull-left">
                    <Checkbox checked={this.state.checked} onChange={this.onChangeCheck}>是否同意 <a href="">注册协议</a></Checkbox>
                  </FormItem>

                  <div className="pull-right">
                    <Link to="/">已有帐号，直接登录</Link>
                  </div>
                  <div className="clear"></div>
                </div>

                <FormItem>
                  <Button type="primary" htmlType="submit">提交注册</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const WrappedRegistrationForm = Form.create()(Register);

export default WrappedRegistrationForm;