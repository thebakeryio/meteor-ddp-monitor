import React, { PropTypes } from 'react';
import _ from 'underscore';
import MethodAudit from './method-audit';

export default React.createClass({
  propTypes : {
    methodsSecurity: PropTypes.object.isRequired
  },

  render () {

    // console.log(this.props.methodsSecurity.toJS());

    let methods = this.props.methodsSecurity.entrySeq().map( ([k, v]) => {
      return <MethodAudit name={k} params={v} />;
    });

    return (
      <div>
        <div className="panel-header">
          <h3>Methods:</h3>
          <p>Check your method arguments.</p>
          <p>See recommendations: <a href="https://guide.meteor.com/security.html#allow-deny" target="_blank">https://guide.meteor.com/security.html#allow-deny</a></p>
        </div>
        <ul className="collection-status">
          {methods}
        </ul>
      </div>
    )
  }
});