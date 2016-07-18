import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  buildDDPMessage,
  testCollectionSecurity,
} from '../lib';
import {
  setCollectionSecurity
} from '../actions';
import Analytics from '../../../common/analytics';
import Bridge from '../../../common/bridge';

class CollectionAudit extends Component {

  constructor(){
    super();
    this._auditCollection = this._auditCollection.bind(this);
    this.state = {
      'testing': false
    };
  }

  _auditCollection() {
    const operations = ['insert', 'update', 'remove'];
    
    operations.forEach((operation) => {

      // send a DDP probe
      Bridge.sendMessageToThePage({
        source: 'security-auditor',
        event: 'test-collection-security',
        ddpMessage: buildDDPMessage(this.props.name, operation),
      });
      this.setState({'testing': true});
      
      // check for DDP response
      // TODO: check with exponential backoff
      setTimeout(() => {
        let res = testCollectionSecurity(this.props.name, operation, this.props.traces);
        this.props.setCollectionSecurity(`/${this.props.name}/${operation}`, res || 'timeout');
        this.setState({'testing': false});
      }, 800);
    });
  
    Analytics.trackEvent('security', 'collection:audit');
  }

  render () {
    const insertStatus = this.props.insertIsSecure;
    const updateStatus = this.props.updateIsSecure;
    const removeStatus = this.props.removeIsSecure;
    const statusClass = classNames('status', {
      'secure' :  insertStatus === 'secure' &&
                  updateStatus === 'secure' && 
                  removeStatus === 'secure',
      'insecure' : insertStatus && updateStatus && removeStatus && 
        (insertStatus === 'insecure' ||
         updateStatus === 'insecure' || 
         removeStatus === 'insecure'),
      'timeout' : insertStatus === 'timeout' &&
                  updateStatus === 'timeout' && 
                  removeStatus === 'timeout',
    });
    const showResults = classNames('operation-results', {
      show: insertStatus
    });
    const buttonLabel = this.state.testing ? 'Testing...' : 'Audit collection';

    return (
      <li>
          <div className={statusClass}></div>
          <div className="desc">
            <strong>{this.props.name}</strong>
            <ul className={showResults}>
              <li className={insertStatus}>Insert: {insertStatus}</li>
              <li className={updateStatus}>Update: {updateStatus}</li> 
              <li className={removeStatus}>Remove: {removeStatus}</li>
            </ul>
            <div> 
              <button onClick={this._auditCollection}>{buttonLabel}</button>
            </div>
          </div>
      </li>
    )
  }
};

CollectionAudit.propTypes = {
  insertIsSecure: PropTypes.string,
  updateIsSecure: PropTypes.string,
  removeIsSecure: PropTypes.string,
  name : PropTypes.string.isRequired,
  traces : PropTypes.array.isRequired,
  setCollectionSecurity : PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    traces: state.traces,
    insertIsSecure: state.collectionSecurity.get(`/${ownProps.name}/insert`),
    updateIsSecure: state.collectionSecurity.get(`/${ownProps.name}/update`),
    removeIsSecure: state.collectionSecurity.get(`/${ownProps.name}/remove`)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCollectionSecurity: (method, isSecure) => {
      dispatch(setCollectionSecurity(method, isSecure));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionAudit);
