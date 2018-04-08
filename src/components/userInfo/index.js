import React, { Component } from 'react';
import { Button, Input, DatePicker, Radio, InputNumber, message, Tooltip } from 'antd';
import headImg from '../../imgs/head_img.png';
import { getCookie, removeCookie } from '../common/methods';
import HttpRequest from '../../requset/Fetch';
import LogList from './component/logListLogin';
import './style.scss';

import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
// const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const RadioGroup = Radio.Group;

// 判断用户
if (!getCookie("JSESSIONID")) {
  message.warning("请登录！");
  window.location.href="/";
}

class UserInfo extends Component {
  state = {
    infoSwitch: [{
      name: "个人信息",
      active: true,
      id: 0
    },{
      name: "登录日志",
      active: false,
      id: 1
    },{
      name: "充值日志",
      active: false,
      id: 2
    },{
      name: "修改密码",
      active: false,
      id: 3
    }],
    newInfoId: 0, // 当前查看的栏目
    sex: "", // 性别状态( 1、男； 2、女 )
    phone: "", // 用户电话
    catname: "个人信息", // 栏目名称
    password: "", // 用户新密码;
    oldPassword: "", // 用户原密码;
    name: "", // 用户姓名
    nickName: "", // 用户昵称
    userInfo: "", //用户信息
    logType: "", // 日志type
    pageSize: 10, // 每页条数
    pageNumber: 1, // 页码
    logListed: [], // 日志列表
  }

  componentDidMount () {
    this.getUserInfo();
  }

  // 获取用户信息
  getUserInfo = () => {
    HttpRequest("/user/info", "POST", {}, res => {
      this.setState({
        userInfo: res.data,
        sex: res.data.sex ? res.data.sex : "",
        name: res.data.name ? res.data.name : "",
        nickName: res.data.nickName ? res.data.nickName : "",
        phone: res.data.phone ? res.data.phone : ""
      })
    })
  }

  // 切换菜单
  switchNavbar = (rowData) => {
    let { infoSwitch } = this.state;
    let newInfoId, catname = rowData.name;

    if (rowData.id === 1) { // 登录日志
      this.setState({
        logType: 102
      }, () => {
        this.getLogList();
      })
    } else if (rowData.id === 0) { // 个人信息
      this.getUserInfo();
    }

    infoSwitch.forEach(item => {
      if (item.name === rowData.name) {
        item.active = true;
        newInfoId = item.id;
      } else {
        item.active = false;
      }
    })

    this.setState({
      infoSwitch,
      newInfoId,
      catname
    })
  }

  // 监听电话
  onChangePhone = (value) => {
    this.setState({
      phone: value
    })
  }

  // 监听修改密码框
  changePasswordInput = (type, e) => {
    if (type === 1) {
      this.setState({
        oldPassword: e.target.value.trim()
      })
    } else {
      this.setState({
        password: e.target.value.trim()
      })
    }
  }

  // 修改用户登录密码
  replaceUserPassWord = () => {
    const { password, oldPassword } = this.state;

    if (password === "") {
      message.warning("新密码不能为空")
    } else {
      HttpRequest("/user/modify/password", "POST", {
        oldPwd: oldPassword,
        newPwd: password
      }, res => {
        message.success("修改成功");
        setTimeout(() => {
          removeCookie('userInfo');
          removeCookie('JSESSIONID');
          window.location.href = "/";
        }, 500);
      })
    }
  }

  // 退出接口;
  handleClickExit = () => {
    HttpRequest('/user/exit', "POST", {}, res => {
      message.success("退出成功");
      setTimeout(() => {
        removeCookie('userInfo');
        removeCookie('JSESSIONID');
        window.location.href = "/";
      }, 500);
    })
  }

  // 监听用户信息
  changeUserInfo = (type, e) => {
    let obj = {};
    let val = e.target.value;
    console.log(val);

    if (type === "name") {
      obj.name = val;
    } else if (type === "nickName") {
      obj.nickName = val;
    } else if (type === "sex") {
      obj.sex = val;
    }

    this.setState({
      ...obj
    })
  }

  // 保存修改用户信息
  saveUserInfo = () => {
    const { name, nickName, sex } = this.state;

    HttpRequest("/user/modify/info", "POST", {
      name,
      nickName,
      sex
    }, res => {
      message.success("修改成功！");
      this.getUserInfo();
    })
  }

  // 获取日志列表;
  getLogList = () => {
    const { pageSize, pageNumber, logType } = this.state;

    HttpRequest("/log/user/query", "POST", {
      size: pageSize, 
      page: pageNumber, 
      type: logType
    }, res => {
      this.setState({
        logListed: res.data
      })
    })
  }

  // 页码回调
  onChangePage = (number) => {
    this.setState({
      pageNumber: number
    }, () => {
      this.getLogList()
    })
  }

  render () {
    const { pageSize, pageNumber, newInfoId, userInfo, logListed } = this.state;
    const { tariff } = userInfo;

    return (
      <section className="user-info-box">
        <header className="user-head">
          <div className="pull-left">
            <h2>{ this.state.catname }</h2>
          </div>
          <div className="pull-right info-group">
            <figure className="info-name__img">
              <img src={ headImg } style={{ width: 35, height: 35 }} alt=""/>
              <figcaption className="name">
                <Tooltip title={ userInfo ? userInfo.account ? userInfo.account : userInfo.email  : "" }>
                  <span>{ userInfo ? userInfo.account ? userInfo.account : userInfo.email  : "" }</span>
                </Tooltip>
              </figcaption>
            </figure>

            <Button type="primary" className="exit" onClick={ this.handleClickExit }>退出</Button>
          </div>
          <div className="clear"></div>
        </header>

        <div className="user-info-content">
          <div className="info-choose">
            <ul className="info-choose__group">
              {
                this.state.infoSwitch.map((item, index) => {
                  return (
                    <li key={ index } onClick={ this.switchNavbar.bind(this, item) } className={ item.active ? "active" : "" }>
                      { item.name }
                    </li>
                  )
                })
              }
            </ul>
          </div>

          {
            // 切换栏目
            newInfoId === 0 // 个人信息
            ?  
            <div className="info-box">
              <div className="info-box__body">
                <div className="info-row-group">
                  <label htmlFor="name">账号：</label>
                  <div className="edit-group">
                    { userInfo ? userInfo.account ? userInfo.account : userInfo.email  : "" }
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">注册时间：</label>
                  <div className="edit-group">
                    { userInfo ? userInfo.time : "" }
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">业务状态：</label>
                  <div className="edit-group">
                    {
                      userInfo ? userInfo.status === 0 ? "未激活" : "正常用户" : ""
                    }
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">账户类型：</label>
                  <div className="edit-group">
                    {
                      userInfo ? tariff.type === 0 ? "按流量" : tariff.type === 1 ?  "持续时长" : "自然时长" : ""
                    }
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">{ userInfo ? tariff.type === 0 ? "剩余流量：" : "剩余时长：" : "" }</label>
                  <div className="edit-group">
                    {
                      userInfo ? tariff.type === 0 ? (tariff.flowTotal - tariff.usedFlow) + "KB" : tariff.type === 1 ?  (tariff.timeTotal - tariff.usedTime) + "s" : (tariff.start - tariff.end) + "s" : ""
                    }
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">姓名：</label>
                  <div className="edit-group">
                    <Input value={ this.state.name } onChange={ this.changeUserInfo.bind(this, "name") } />
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">昵称：</label>
                  <div className="edit-group">
                    <Input value={ this.state.nickName } onChange={ this.changeUserInfo.bind(this, "nickName") } />
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">生日：</label>
                  <div className="edit-group">
                    {
                      userInfo.birthDay ?
                      <DatePicker defaultValue={moment(userInfo.birthDay, dateFormat)} format={dateFormat} />
                      :
                      <DatePicker format={dateFormat} />
                    }
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">性别：</label>
                  <div className="edit-group">
                    <RadioGroup value={this.state.sex}  onChange={ this.changeUserInfo.bind(this, "sex") }>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="info-row-group">
                  <label htmlFor="name">电话：</label>
                  <div className="edit-group">
                    <InputNumber style={{ width: "100%", height: 36 }} min={1} defaultValue={userInfo ? userInfo.phone : ""} onChange={this.onChangePhone} disabled={true} />
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">邮箱：</label>
                  <div className="edit-group">
                    <Input value={ userInfo ? userInfo.email : "" } disabled={true} />
                  </div>
                </div>

                <div className="info-row-group">
                  <label htmlFor="name">地址：</label>
                  <div className="edit-group">
                    <Input defaultValue={ userInfo ? userInfo.address : "" } />
                  </div>
                </div>

                <div className="info-row-group" style={{ marginTop: 20 }}>
                  <label htmlFor="name" style={{ height: 40 }}></label>
                  <div className="edit-group">
                    <Button style={{ width: 110, height: 40 }} type="primary" onClick={ this.saveUserInfo }>保存修改</Button>
                  </div>
                </div>
              </div>
            </div>
            :
            newInfoId === 1 // 用户登录日志
            ?
            <div className="info-box">
              <LogList 
                dataSource={ logListed }
                pageSize={ pageSize }
                pageNumber={ pageNumber }
                onChangePage={ this.onChangePage }
              />
            </div>
            :
            newInfoId === 2 // 用户充值日志
            ?
            <div className="info-box"></div>
            :
            newInfoId === 3 // 修改密码
            ?
            <div className="info-box">
              <div className="info-row-group">
                <label htmlFor="name">原密码：</label>
                <div className="edit-group">
                  <Input type="password" onChange={ this.changePasswordInput.bind(this, 1) } />
                </div>
              </div>
              
              <div className="info-row-group">
                <label htmlFor="name">新密码：</label>
                <div className="edit-group">
                  <Input type="password" onChange={ this.changePasswordInput.bind(this, 2) } />
                </div>
              </div>

              <div className="info-row-group" style={{ marginTop: 20 }}>
                <label htmlFor="name" style={{ height: 40 }}></label>
                <div className="edit-group">
                  <Button style={{ width: 110, height: 40 }} type="primary" onClick={ this.replaceUserPassWord }>确定修改</Button>
                </div>
              </div>
            </div>
            :
            ""
          }
        </div>
      </section>
    )
  }
}

export default UserInfo;