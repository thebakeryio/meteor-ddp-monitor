import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  buildDDPMessage,
  testCollectionSecurity
} from '../lib';
import {
  setCollectionSecurity
} from '../actions';
import Bridge from '../../../common/bridge'

class CollectionAudit extends Component {

  constructor(){
    super();
    this._auditCollection = this._auditCollection.bind(this);
  }

  _auditCollection() {
    Bridge.sendMessageToThePage({
      source: 'security-auditor',
      event: 'test-collection-security',
      ddpMessage: buildDDPMessage(this.props.name, 'insert')
    });
    
    setTimeout(() => {
      const isSecure = testCollectionSecurity(this.props.name, 'insert', this.props.traces);
      this.props.setCollectionSecurity(this.props.name, isSecure);
    }, 1000);
  }

  render () {

    let collectionClass = classNames({
      'secure' : this.props.isSecure === 'secure',
      'insecure' : this.props.isSecure === 'insecure'
    });

    return (
      <li className={this.props.isSecure}>
          <div className="status"></div>
          <div className="desc">
            <strong>{this.props.name}</strong>
            <p className="is-secure">Insert: {this.props.isSecure}</p>
            <div> 
              <button onClick={this._auditCollection}>Audit collection</button>
            </div>
          </div>
      </li>
    )
  }

};

CollectionAudit.propTypes = {
  isSecure: PropTypes.bool,
  name : PropTypes.string.isRequired,
  traces : PropTypes.array.isRequired,
  setCollectionSecurity : PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    traces: state.traces,
    isSecure: state.collectionSecurity.get(ownProps.name)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCollectionSecurity: (collection, isSecure) => {
      console.log('dispatching collection security');
      dispatch(setCollectionSecurity(collection, isSecure));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionAudit);
