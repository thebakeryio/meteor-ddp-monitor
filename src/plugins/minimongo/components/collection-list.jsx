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
      .sortBy(([k, v]) => k).map( ([k, v]) => {
        return (
          <CollectionItem 
            changeCollectionSelection={this.props.changeCollectionSelection}
            isSelected={this.isSelected(k)}
            key={k} name={k} size={v.length} 
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