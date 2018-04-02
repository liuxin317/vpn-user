import React, { Component } from 'react';
import Loading from './components/common/Loading';
import Foot from './components/common/footer';

// 路由相关
import {BrowserRouter as Router} from 'react-router-dom';
// import history from './components/common/history';
import ViewRoute from './router';

class App extends Component {
  render() {
    return (
      <Router>
        <section className="box">
            <Loading />
            <ViewRoute />
            
            <Foot />
        </section>
      </Router>
    )
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     hideLoadClick: () => { dispatch({ type: Type.LOAD_STATE, payload: { loading: false } }) }
//   }
// }

export default App;
