import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Bridge from '../../common/bridge'
import _ from 'underscore';
import {
  setPackageList,
  setCollectionSecurity,
  setSecurityTab
} from './actions';
import CollectionPanel from './components/collections-panel';
import PackageAudit from './components/package-audit';
import Analytics from '../../common/analytics';
import './security.css';


let dispatch = null;

const onNewMessage = (error, message) => {
  if(message && message.eventType === 'security-auditor'){
    dispatch(setPackageList(message.data));
  }
};

class App extends Component {
  componentDidMount() {
    dispatch = this.props.dispatch;
    
    if(chrome && chrome.devtools) {
      Bridge.registerMessageCallback(onNewMessage);
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
    // Analytics.trackPageView('security audit');
  }

  componentWillUnmount() {
    Bridge.removeMessageCallback(onNewMessage);
  }

  _handleClick(index) {
    console.log(index);
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

    const Tabs = [{
        name: 'Packages',
        component: <PackageAudit packages={this.props.packageList} />
      },
      {
        name: 'Collections',
        component: <CollectionPanel collectionData={this.props.collectionData} />
    }];

    return (
      <div className="security">
        <aside className="sidebar">
          <ul>
            {this._showTabs(Tabs, this.props.securityTabsIndex)}
          </ul>
        </aside>
        <section>
          {this._showSelectedComponent(Tabs, this.props.securityTabsIndex)}
        </section>
       
      </div> 
    )
  }
}

App.propTypes = {
  collectionData: PropTypes.func,
  collectionSecurity: PropTypes.object,
  packageList : PropTypes.object,
  traces: PropTypes.array,
  securityTabsIndex: PropTypes.number,
}


export default connect((state) => {
  return {
    packageList: state.packageList,
    collectionData : () => {
      return state.minimongoCollectionData.map((value, key) => {
        return {
          'name': key,
          'size': value.count()
        }
      }).sort((a, b) =>  a.name < b.name ? -1 : 1);
    },
    collectionSecurity: state.collectionSecurity,
    traces: state.traces,
    securityTabsIndex: state.securityTabsIndex
  }
})(App)