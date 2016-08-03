import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Bridge from '../../common/bridge'
import _ from 'underscore';
import {
  setPackageList,
  setCollectionSecurity,
  setSecurityTab,
  clearMethodSecurity
} from './actions';
import SplitPane from 'react-split-pane';
import CollectionPanel from './components/collections-panel';
import PackageAudit from './components/package-audit';
import MethodsPanel from './components/methods-panel';
import Analytics from '../../common/analytics';
import './security.scss';


let dispatch = null;

const onNewMessage = (error, message) => {
  if(message && message.eventType === 'security-auditor'){
    dispatch(setPackageList(message.data));
  }
};

const onPageReload = () => {
  dispatch(clearMethodSecurity());
  dispatch(setPackageList());  
  Bridge.sendMessageToThePage({
    source: 'security-auditor',
    event: 'get-package-list'
  });
};

class App extends Component {
  componentDidMount() {
    dispatch = this.props.dispatch;
    if(chrome && chrome.devtools) {
      Bridge.registerMessageCallback(onNewMessage);
      Bridge.registerPageReloadCallback(onPageReload);
      Bridge.sendMessageToThePage({
        source: 'security-auditor',
        event: 'get-package-list'
      });
    } else {
      // inside standalone web app
      onNewMessage.call(this, null, {
        eventType: 'security-auditor',
        data: [
          'autopublish',
          'insecure',
          'something-else'
        ]
      });
    }
    Analytics.trackPageView('security audit');
  }

  componentWillUnmount() {
    Bridge.removeMessageCallback(onNewMessage);
  }

  _handleClick(index) {
    dispatch(setSecurityTab(index));
  }

  _showTabs(tabs, selectedIndex) {
    return tabs.map((t, i) => {
      const selected = (i === selectedIndex) && 'selected';
      const boundClick = this._handleClick.bind(this, i);
      return (
        <li className={selected} 
          key={i}
          onClick={boundClick}>
          {t.name}
        </li>
      );
    });
  }

  _showSelectedComponent(tabs, selectedIndex) {
    return tabs[selectedIndex] && tabs[selectedIndex].component;
  }

  render() {
    const { dispatch } = this.props;
    const Tabs = [
      {
        name: 'Packages',
        component: <PackageAudit packages={this.props.packageList} />
      },
      {
        name: 'Collections',
        component: <CollectionPanel collectionData={this.props.collectionData} traces={this.props.resultTraces} />
      },
      {
        name: 'Methods',
        component: <MethodsPanel methodsSecurity={this.props.methodsSecurity} traces={this.props.resultTraces} />
      },
    ];

    return (
      <div className="security">
        <SplitPane defaultSize={250} maxSize={400} minSize={100} split="vertical">
            <div className="sidebar">
              <ul>
                {this._showTabs(Tabs, this.props.securityTabsIndex)}
              </ul>
            </div>
            <div>
              <div className="main-panel">
                {this._showSelectedComponent(Tabs, this.props.securityTabsIndex)}
              </div>
            </div>
        </SplitPane>
       
      </div> 
    )
  }
}

App.propTypes = {
  collectionData: PropTypes.object,
  packageList : PropTypes.object,
  securityTabsIndex: PropTypes.number,
  methodsSecurity: PropTypes.object,
  resultTraces: PropTypes.object.isRequired
}

export default connect((state) => {
  return {
    packageList: state.packageList,
    collectionData : state.minimongoCollectionData,
    securityTabsIndex: state.securityTabsIndex,
    methodsSecurity: state.methodsSecurity,
    resultTraces: state.resultTraces,
  }
})(App)