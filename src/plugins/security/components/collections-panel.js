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

         <section>
          <h3>Collections:</h3>
          <ul>
            {collections}
          </ul>
        </section>
    )
  }
});