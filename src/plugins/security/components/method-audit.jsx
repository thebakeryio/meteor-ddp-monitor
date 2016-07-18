import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  buildDDPMethodTester,
  testCollectionSecurity,
} from '../lib';
import {
  setCollectionSecurity
} from '../actions';
import Analytics from '../../../common/analytics';
import Bridge from '../../../common/bridge';

class MethodAudit extends Component {

  constructor(){
    super();
    this._auditMethod = this._auditMethod.bind(this);
    this.state = {
      'testing': false
    };
  }

  _auditMethod() {
    const params = ['string', 'number', 'object'];
    
    params.forEach((operation) => {

      // send a DDP probe
      Bridge.sendMessageToThePage({
        source: 'security-auditor',
        event: 'test-method-params',
        ddpMessage: buildDDPMethodTester(this.props.name, params),
      });
      this.setState({'testing': true});
      
    });
  
    Analytics.trackEvent('security', 'method:audit');
  }

  render () {
    console.log('render method audit');
    const buttonLabel = this.state.testing ? 'Testing...' : 'Audit collection';
    const paramsType = this.props.params.map((m) => {
      return <span>{m} / </span>
    });

    return (
      <li key={this.props.name}>
          <div className=""></div>
          <div className="desc">
            <strong>{this.props.name}</strong>
            <p>{paramsType}</p>
            <div> 
              <button onClick={this._auditMethod}>{buttonLabel}</button>
            </div>
          </div>
      </li>
    )
  }
};

MethodAudit.propTypes = {
  name : PropTypes.string.isRequired,
  traces : PropTypes.array.isRequired,
  params : PropTypes.array,
  setMethodSecurity : PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    traces: state.traces,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMethodSecurity: (method, isSecure) => {
      dispatch(setMethodSecurity(method, isSecure));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MethodAudit);
