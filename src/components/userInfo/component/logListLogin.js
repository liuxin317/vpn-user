import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const columns = [{
  title: 'IP',
  dataIndex: 'ip',
  key: 'ip'
}, {
  title: '时间',
  dataIndex: 'time',
  key: 'time',
  render: (text, record) => {
    return <span>{ moment(record.time).format(timeFormat) }</span>
  }
}];

class LogList extends Component {
  render () {
    const { pageSize, pageNumber, dataSource, onChangePage } = this.props;

    return (
      <section className="table-box">
        <Table 
          rowKey={(record, index) => index} 
          bordered 
          dataSource={dataSource.content} 
          columns={columns} 
          pagination={{ showQuickJumper: true, total: dataSource.contentSize, current: pageNumber, pageSize, onChange: onChangePage,  showTotal: total => `共 ${dataSource.contentSize} 条`  }}
        />
      </section>
    )
  }
}

export default LogList;