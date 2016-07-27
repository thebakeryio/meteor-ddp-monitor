import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  buildDDPMessage,
} from '../lib';
import Analytics from '../../../common/analytics';
import Bridge from '../../../common/bridge';

const getResultForOperation = (traces, collection, operation) => {
  const id = `/audit/${collection}/${operation}`;
  const res = traces.find((trace) => {
    return trace.message.id === id;
  });
  if(!res){
    return false;
  } else {
    return res.message && res.message.error && 
      res.message.error.error === 403 ? 'secure' : 'insecure';
  }
};

export default React.createClass({
  propTypes : {
    traces: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return !this.props.traces.equals(nextProps.traces);
  },

  _auditCollection() {
    const operations = ['insert', 'update', 'remove'];
    
    operations.forEach((operation) => {
      // send a DDP probe
      Bridge.sendMessageToThePage({
        source: 'security-auditor',
        event: 'test-collection-security',
        ddpMessage: buildDDPMessage(this.props.name, operation),
      });
    });
  
    Analytics.trackEvent('security', 'collection:audit');
  },

  _showResults(result, operation) {
    return result && <li className={result}>{operation}: {result}</li>;
  },

  render () {
    const insertResult = getResultForOperation(this.props.traces, this.props.name, 'insert');
    const updateResult = getResultForOperation(this.props.traces, this.props.name, 'update');
    const removeResult = getResultForOperation(this.props.traces, this.props.name, 'remove');

    const statusClass = classNames('status', {
      'secure' :  insertResult === 'secure' && updateResult === 'secure' && removeResult === 'secure',
      'insecure' : (insertResult && updateResult && removeResult) &&
        (insertResult !== 'secure' || updateResult !== 'secure' || removeResult !== 'secure')
    });
    const resultClass = classNames('operation-results', {
      'show': insertResult || updateResult || removeResult
    });

    return (
      <li>
          <div className={statusClass}>&#11044;</div>
          <div className="desc">
            <strong>{this.props.name}</strong>
            <ul className={resultClass}>
              {this._showResults(insertResult, 'Insert')}
              {this._showResults(updateResult, 'Update')}
              {this._showResults(removeResult, 'Remove')}
            </ul>
            <div> 
              <button onClick={this._auditCollection}>Audit collection</button>
            </div>
          </div>
      </li>
    )
  }
});


