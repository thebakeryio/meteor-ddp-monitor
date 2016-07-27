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
import JSONTree from 'react-json-tree';
import MethodStatus from './method-audit';

export default React.createClass({
  propTypes : {
    traces: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    params : PropTypes.array,
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return !this.props.traces.equals(nextProps.traces);
  },

  _auditMethod(argType, argument) {    
    // send a DDP probe
    Bridge.sendMessageToThePage({
      source: 'security-auditor',
      event: 'test-method-params',
      ddpMessage: buildDDPMethodTester(this.props.name, argType, argument),
    });
    this.setState({'testing': true});
  
    Analytics.trackEvent('security', 'method:audit');
  },

  _showResult(argType) {
    const response = this.props.traces.find((trace) => {
      return trace.message.id === `/audit/${this.props.name}/${argType}`;
    });
    if (!response) { return; }
    if(response.message && response.message.error) {
      if(response.message.error.reason === 'Match failed'){
        return <div className="valid"><span className="check-status">&#11044;</span>Blocked by check</div>;
      } else {
        return <div className="error"><span className="check-status">&#11044;</span>Unknown error</div>;
      }
    } else {
      return <div className="warning"><span className="check-status">&#11044;</span>Method called</div>;
    }
  },

  render () {
    const theme = {
      tree: {
        backgroundColor: 'transparent',
        fontSize: '1em'
      },
      arrow: ({ style }, type, expanded) => ({
        style: Object.assign(style, {
            marginTop: 2
        })
      }),
    };

    const valueRenderer = (raw) => {
      const type = typeof raw;
      return <span>{raw} <span className="arg-type">// {type}</span></span>
    };

    const checkMethod = ['string', 'number', 'object'].map((argType) => {
      return (<div className="check-method">
          <button onClick={() => this._auditMethod(argType)}>Call with <em>{argType}</em></button>
          <div>{this._showResult(argType)}</div>
      </div>);
    });

    return (
      <li key={this.props.name}>
          <div><strong>{this.props.name}</strong></div>
          <div className="method-content">
            <div className="args">Called with args: </div>
            <JSONTree 
              data={this.props.params} 
              hideRoot
              theme={theme} 
              valueRenderer={valueRenderer}
            />
            <div className="method-audit">
              {checkMethod}
            </div>
          </div>
      </li>
    )
  }
});
