import React, { PropTypes } from 'react';
import MethodAudit from './method-audit';

export default React.createClass({
  propTypes : {
    methodsSecurity: PropTypes.object.isRequired,
    traces: PropTypes.object.isRequired
  },

  // only send relevant traces to child components
  _filterTraces : (traces, name) => {
    return traces.filter((trace) => {
      return trace.message.id && trace.message.id.startsWith(`/audit/${name}`);
    });
  },

  render () {
    let methods = this.props.methodsSecurity.entrySeq().map( ([k, v]) => {
      return <MethodAudit key={k} name={k} params={v} traces={this._filterTraces(this.props.traces, k)} />;
    });

    let noMethod = () => {
      if(!this.props.methodsSecurity.size){
        return (<li>
          <p className="gray">No methods recorded yet. Browse around your application and outgoing method calls will show up here.</p>
        </li>);
      }
    };

    return (
      <div>
        <div className="panel-header">
          <h3>Methods:</h3>
          <p>Check your method arguments.</p>
          <p>See recommendations: <a href="https://guide.meteor.com/security.html#validate-arguments" target="_blank">https://guide.meteor.com/security.html#allow-deny</a></p>
          <p className="caution">Use with care: methods calls might update your data.</p>
        </div>
        <ul className="methods-status">
          {methods}
          {noMethod()}
        </ul>
      </div>
    )
  }
});