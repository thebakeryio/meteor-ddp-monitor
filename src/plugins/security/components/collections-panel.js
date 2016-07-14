import React, { PropTypes } from 'react';
import _ from 'underscore';
import CollectionAudit from './collection-audit';

export default React.createClass({
  propTypes : {
    collectionData: PropTypes.func.isRequired
  },

  render () {

    let collections = this.props.collectionData().keySeq().map((c) => {
      return (
      <CollectionAudit
        key={c} 
        name={c} 
      />);
    });

    return (
      <div>
        <div className="panel-header">
          <h3>Collections:</h3>
          <p>Avoid using Allow or Deny rules to run Insert/Update/Remove queries from the client.</p>
          <p>See recommendations: <a href="https://guide.meteor.com/security.html#allow-deny" target="_blank">https://guide.meteor.com/security.html#allow-deny</a></p>
        </div>
        <ul className="collection-status">
          {collections}
        </ul>
      </div>
    )
  }
});