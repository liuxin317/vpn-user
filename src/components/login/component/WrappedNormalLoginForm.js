import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Store from '../../../store';
import Type from '../../../action/Type';
import { Form, Icon, Input, Button, Radio, message, Select, Tooltip } from 'antd';
import HttpRequest from '../../../requset/Fetch';
import { setCookie, getCookie } from '../../common/methods';
import GetCode from '../../common/getCode';
import countryCode from '@/configure/countryCode';
import { Redirect } from "react-router-dom";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class NormalLoginForm extends Component {
  state = {
    account: "", // 帐号名称
    password: "", // 密码
    email: "", // 邮箱地址
    phone: "", // 手机号
    code: "", // 验证码
    phoneStatus: 2, // 手机登陆方式
    redirect: getCookie("JSESSIONID") ? true : false, // 登录是否成功
    areaCode: '+86', // 区号
  }

  componentDidMount () {
    Store.dispatch({ type: Type.CLEAR_INIT_DATA, payload: { clearInitData: this.clearInitData } })
  }

  // 登录提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { email, account, phone, code, password, phoneStatus, areaCode } = this.state;
    const { newloginStatus } = this.props;
    let loginStatus = phoneStatus === 2 ? newloginStatus : phoneStatus;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (Number(loginStatus) === 1) { // 验证邮箱格式
          let filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!filterEmail.test(email)) {
            message.warning('邮箱格式不正确！');
            return false;
          }
        } 
        // else if (Number(loginStatus) === 2 || Number(loginStatus) === 3) { // 验证手机号
        //   let filterPhone = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        //   if (!filterPhone.test(phone)) {
        //     message.warning('手机格式不正确！');
        //     return false;
        //   }
        // }

        console.log(loginStatus, code)

        HttpRequest("/user/login", "POST", {
          type: loginStatus,
          email,
          account,
          phone: (areaCode ? areaCode : '') + phone,
          code,
          password
        }, res => {
          message.success('登录成功');
          // 登录成功后清空数据;
          this.clearInitData();
          // JSESSIONID
          setCookie("JSESSIONID", res.data.cookieId);

          // 跳转进入用户信息界面
          this.setState({
            redirect: true
          });
        })
      }
    });
  }

  // 选择登录方式初始化数据
  clearInitData = () => {
    this.setState({
      email: "",
      account: "",
      phone: "",
      code: "",
      password: ""
    })
  }

  // 监听输入框
  handleChangeInput = (type, e) => {
    let val = e.target.value;
    let obj = {};

    switch (type) {
      case "帐号":
        obj["account"] = val
        break;
      case "密码":
        obj["password"] = val
        break;
      case "邮箱":
        obj["email"] = val
        break;
      case "手机号":
        obj["phone"] = val
        break;
      case "验证码":
        obj["code"] = val
        break;
      default:
        break;
    }

    this.setState({
      ...obj
    })
  }

  // 监听手机登陆方式
  handleChangePhone = (e) => {
    let value = e.target.value;

    this.setState({
      phoneStatus: value
    });
  }

  // 监听手机区号
  onChangeSelected = (value, options) => {
    console.log(options.props.item.nationalPhoneCode)
    this.setState({
      areaCode: options.props.item.nationalPhoneCode
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { newloginStatus } = this.props;
    const { email, account, phone, code, password, redirect } = this.state;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'China +86',
    })(
      <Select onChange={this.onChangeSelected} style={{ maxWidth: 180 }}>
        {
          countryCode.map((item, index) => {
            return <Option value={item.name} item={item} key={index}><Tooltip title={ item.name + ' ' + item.nationalPhoneCode }>{ item.name + ' ' + item.nationalPhoneCode }</Tooltip></Option>
          })
        }
      </Select>
    );
    let LoginInputGroup;

    if (redirect) {
      return <Redirect push to="/info" />
    }

    if (newloginStatus === 0) {
      LoginInputGroup = (
        <div>
          <FormItem>
            {getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入帐号！' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "帐号") } setfieldsvalue={ account } placeholder="账号" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "密码") } setfieldsvalue={ password } type="password" placeholder="密码" />
            )}
          </FormItem>
        </div>
      )
    } else if (newloginStatus === 1) {
      LoginInputGroup = (
        <div>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '请输入邮箱帐号！' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "邮箱") } setfieldsvalue={ email } placeholder="邮箱帐号" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password_02', {
              rules: [{ required: true, message: '请输入邮箱密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "密码") } setfieldsvalue={ password } type="password" placeholder="邮箱密码" />
            )}
          </FormItem>
        </div>
      )
    } else {
      LoginInputGroup = (
        <div>
          <div className="radio-group">
            <RadioGroup onChange={this.handleChangePhone} value={this.state.phoneStatus}>
              <Radio value={2}>密码登陆</Radio>
              {/* <Radio value={3}>动态验证码登陆</Radio> */}
            </RadioGroup>
          </div>

          <FormItem>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入手机号！' }],
            })(
              <Input addonBefore={prefixSelector} prefix={<Icon type="tablet" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "手机号") } setfieldsvalue={ phone } placeholder="手机号" />
            )}
          </FormItem>

          {
            this.state.phoneStatus === 2 ?
            <FormItem>
              {getFieldDecorator('password_03', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "密码") } setfieldsvalue={ password } type="password" placeholder="密码" />
              )}
            </FormItem>
            :
            <FormItem>
              <div className="pull-left" style={{ width: "62%" }}>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入验证码!' }],
                })(
                  <Input prefix={<Icon type="mail" setfieldsvalue={ code } style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={ this.handleChangeInput.bind(this, "验证码") } placeholder="验证码" />
                )}
              </div>
              <GetCode account={phone} type="phone" />
              <div className="clear"></div>
            </FormItem>
          }
        </div>
      )
    }

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {
          LoginInputGroup
        }

        <FormItem>
          <div>
            <Link to="/register"><span className="login-form-forgot pull-right">注册账户</span></Link> 
            <Link to="/retrieval-pw"><span className="login-form-forgot pull-left">忘记密码</span></Link> 
            <div className="clear"></div>
          </div>
          
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ display: "block", width: "100%", height: 40, marginTop: 10 }}>
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;