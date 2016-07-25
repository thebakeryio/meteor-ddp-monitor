import React, { PropTypes } from 'react';
import CollectionItem from './collection-item';

export default React.createClass({
  propTypes : {
    collections : PropTypes.object.isRequired,
    changeCollectionSelection: PropTypes.func.isRequired,
    currentSelection: PropTypes.string
  },

  isSelected (itemName) {
    return this.props.currentSelection === itemName;
  },

  render () {
    const noData = this.props.collections.count() === 0 ?
      <li className="no-collections">No collections yet...</li> : null;
    

    const items = this.props.collections.entrySeq()
      .sortBy(([k, v]) => k).map( ([key, value]) => {
        return (
          <CollectionItem 
            changeCollectionSelection={this.props.changeCollectionSelection}
            isSelected={this.isSelected(key)}
            key={key} name={key} size={value.size} 
          />
        )
    });

    return (
      <ul className="minimongo-collections">
        {noData}
        {items}
      </ul>
    )
  }
});