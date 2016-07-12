import React, { PropTypes } from 'react';
import _ from 'underscore';

export default React.createClass({
  propTypes : {
    packages: PropTypes.object.isRequired
  },

  _checkPackageIsRemoved (packageName) {
    if(this.props.packages.get(packageName)){
      return <li className="warning">You should consider removing the <strong>{packageName}</strong> package.</li>;
    } else {
      return <li className="valid"><strong>{packageName}</strong> package was removed.</li>;
    }
  },

  _checkPackageIsIncluded (packageName) {
    if(this.props.packages.get(packageName)){
      return <li className="warning">You should consider including the <strong>{packageName}</strong> package.</li>;
    } else {
      return <li className="valid"><strong>{packageName}</strong> package is included.</li>;
    }
  },

  render () {

    return (
      <div>
        <h3>Packages:</h3>
        <ul className="package-status">
          {this._checkPackageIsRemoved('insecure')}
          {this._checkPackageIsRemoved('autopublish')}
          {this._checkPackageIsIncluded('audit-argument-checks')}
        </ul>
      </div>
    )
  }
});