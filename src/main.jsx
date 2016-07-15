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
              <a href="https://github.com/thebakeryio/meteor-devtools" target="_blank">
                <i className="fa fa-bug"></i> Bugs, Features, PRs
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
