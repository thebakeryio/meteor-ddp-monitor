import 'babel-polyfill'
import { getStore, getPlugins } from './plugins'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import React, { Component, PropTypes } from 'react';
import NotificationSystem from 'react-notification-system'
import {Tab, Tabs, TabList, TabPanel} from './patch/react-tabs'
import _ from 'underscore';
import Analytics from './common/analytics';
import slugify from 'slugify';
import Bridge from './common/bridge';
import './common/styles/app.scss';
import { setTabIndex } from './common/actions';

class App extends Component {
  showGlobalError(msg) {
    this._notificationSystem.addNotification({
      message: msg,
      level: 'error',
      position: 'br'
    });
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    window.onerror = (message) => {
      this.showGlobalError(message);
    };
    Analytics.trackPageView('loaded devtools');
  }

  render() {
    const { dispatch, tabIndex } = this.props;
    const plugins = getPlugins();
    const tabs = _.map(plugins, (p) => {
      const keyName = `tab-${slugify(p.name)}`;
      return <Tab key={keyName}>{p.name}</Tab>;
    });
    const tabPanels = _.map(plugins, (p) => {
      const keyName = `tab-panel-${slugify(p.name)}`;
      return <TabPanel className="app-tab-panel" key={keyName}>{p.component}</TabPanel>;
    });

    const _handleSelect = (index, last) => {
      dispatch(setTabIndex(index));
    };

    const notificaitonStyle = {
      NotificationItem: {
        DefaultStyle: {
          margin: '10px 5px 40px 1px'
        }
      }
    };
    return (
      <div className="tab-wrapper">
        <Tabs className="app-tabs" 
          forceRenderTabPanel
          onSelect={_handleSelect} 
          selectedIndex={this.props.tabIndex}
        >
          <TabList>
            {tabs}
            <li className="gh-link">
              <a href="http://thebakery.io?ref=mdt" target="_blank">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="88.008px" height="129.007px" viewBox="0 0 88.008 129.007" enable-background="new 0 0 88.008 129.007" className="icon-baker-logo">
                  <g>
                    <g>
                      <path fill="#00e" id="baker-logo" d="M44.033,103.265c-10.209,0-20.505-1.524-25.741-4.478c0.601,6.054,0.921,11.592,0.921,16.364
                        c0,4.403,0.892,7.038,2.343,8.414c1.715,3.084,11.044,5.441,22.298,5.441c0.051,0,0.1-0.002,0.15-0.002s0.1,0.002,0.15,0.002
                        c11.255,0,20.585-2.357,22.298-5.441c1.451-1.377,2.342-4.012,2.342-8.414c0-4.765,0.32-10.294,0.919-16.337
                        c-1.445,0.805-3.312,1.526-5.589,2.153C58.738,102.448,51.603,103.265,44.033,103.265z M62.394,5.839
                        c-1.548-0.294-3.023-0.506-4.435-0.645C54.3,1.966,49.461,0,44.154,0c-0.05,0-0.1,0.003-0.15,0.003S43.905,0,43.854,0
                        c-5.308,0-10.146,1.966-13.806,5.195c-1.411,0.138-2.887,0.35-4.434,0.645C1.841,10.364,0,13.966,0,13.966
                        c8.49,23.702,15.166,54.28,17.887,78.099c1.695,2.489,11.519,5.564,26.146,5.564c14.454,0,24.212-3.002,26.078-5.475
                        c2.713-23.832,9.396-54.456,17.896-78.188C88.008,13.966,86.167,10.364,62.394,5.839z"></path>
                    </g>
                  </g>
                </svg>
                The Bakery
              </a>
              &nbsp;|&nbsp;
              <a href="https://github.com/thebakeryio/meteor-devtools" target="_blank">
                <i className="fa fa-bug"></i>
              </a>
            </li>
          </TabList>
          {tabPanels}
        </Tabs>  
        <NotificationSystem ref="notificationSystem" style={notificaitonStyle} />
      </div>
    )
  }
}

App.propTypes = {
  tabIndex : PropTypes.number,
};

((rootElement, AppContainer, store) => {
  Bridge.setup()
  Analytics.setup()
  rootElement.innerHTML = ''
  render(<Provider store={store}><AppContainer /></Provider>, rootElement)
})(document.querySelector('.app-container'), connect((state) => {
  return {
    tabIndex: state.tabIndex
  }
})(App), getStore())
