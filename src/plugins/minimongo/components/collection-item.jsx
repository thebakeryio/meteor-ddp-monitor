import React, { PropTypes } from 'react';

export default React.createClass({
  propTypes : {
    name : PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    changeCollectionSelection: PropTypes.func.isRequired
  },

  changeSelection () {
    this.props.changeCollectionSelection(this.props.name);
  },

  render () {
    return (
      <li className={(this.props.isSelected ? 'selected' : '')}
      onClick={this.changeSelection}>
        {this.props.name} ({this.props.size})
      </li>
    )
  }
});