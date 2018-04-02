import React, { Component } from 'react';
import { Icon } from 'antd';
import "./style.scss";

class Foot extends Component {
  render () {
    return (
      <footer className="footer">
        <p>Copyright  2018 <Icon type="copyright" />成都燃光科技有限公司出品</p>
      </footer>
    )
  }
}

export default Foot;