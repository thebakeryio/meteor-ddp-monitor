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

class MethodAudit extends Component {

  constructor(){
    super();
    this._auditMethod = this._auditMethod.bind(this);
    this.state = {
      'testing': false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only rerender if new result traces have come in
    return !nextProps.resultTraces.equals(this.props.resultTraces);
  }

  _auditMethod(argType, argument) {    
    // send a DDP probe
    Bridge.sendMessageToThePage({
      source: 'security-auditor',
      event: 'test-method-params',
      ddpMessage: buildDDPMethodTester(this.props.name, argType, argument),
    });
    this.setState({'testing': true});
  
    Analytics.trackEvent('security', 'method:audit');
  }

  _showResult(argType) {
    const response = this.props.resultTraces.find((trace) => {
      return trace.message.id === `/audit/${this.props.name}/${argType}`;
    });
    if (!response) { return; }
    if(response.message && response.message.error) {
      if(response.message.error.reason === 'Match failed'){
        return <div className="valid">&#8226; Blocked by check</div>;
      } else {
        return <div className="error">&#8226; Method returned an error</div>;
      }
    } else {
      return <div className="warning">&#8226; Method called</div>;
    }
  }

  render () {
    const buttonLabel = this.state.testing ? 'Testing...' : 'Audit method';
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
            <div className="args">Arguments: </div>
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
};

MethodAudit.propTypes = {
  name : PropTypes.string.isRequired,
  resultTraces : PropTypes.object.isRequired,
  params : PropTypes.array,
  setMethodSecurity : PropTypes.func.isRequired
};

const getResultTraces = (traces) => {
  return traces.filter((trace) => {
    return trace.message.msg === 'result';
  });
};

function mapStateToProps(state, ownProps) {
  return {
    resultTraces: getResultTraces(state.traces),
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
