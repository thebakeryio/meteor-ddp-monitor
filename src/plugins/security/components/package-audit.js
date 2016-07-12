import React, { PropTypes } from 'react';
import _ from 'underscore';

export default React.createClass({
  propTypes : {
    packages: PropTypes.object.isRequired
  },

  _checkPackageIsRemoved (packageName) {
    if(this.props.packages.get(packageName)){
      return (
        <li className="warning">
          <div className="status"></div>
          <p>You should consider removing the <strong>{packageName}</strong> package.</p>
        </li>);
    } else {
      return (
        <li className="valid">
          <div className="status"></div>
          <p><strong>{packageName}</strong> package was removed.</p>
        </li>);
    }
  },

  _checkPackageIsIncluded (packageName) {
    if(!this.props.packages.get(packageName)){
      return (
        <li className="warning">
          <div className="status"></div>
          <p>You should consider including the <strong>{packageName}</strong> package.</p>
        </li>);
    } else {
      return (
        <li className="valid">
          <div className="status"></div>
          <p><strong>{packageName}</strong> package is included.</p>
        </li>
      );
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