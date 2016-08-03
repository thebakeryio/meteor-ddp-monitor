import React, { PropTypes } from 'react';
import JSONTree from 'react-json-tree';

export default React.createClass({
  propTypes : {
    data : PropTypes.array.isRequired
  },

  render () {

    const theme = {
      tree: {
        backgroundColor: 'transparent',
        fontSize: '1em'
      },
      arrow: ({ style }, type, expanded) => ({
        style: Object.assign(style, {
            marginTop: 2
        })
      }),
    };
    
    const getItemString = (type, data, itemType, itemString) => {
      let id = (typeof data._id) === 'string' ? data._id : 
        data._id && data._id._str;
      return (<span> {id} {itemType} {itemString} </span>);
    };

    // expand the first node if its an only child
    const shouldExpandNode = (keyPath, data, level) => {
      return (level === 1) && (this.props.data.length === 1);
    };

    if(this.props.data.length === 0){
      return <div className="no-minimongo">No items in this collection.</div>
    } else {
      return (
        <JSONTree 
        data={this.props.data} 
        getItemString={getItemString} 
        hideRoot
        shouldExpandNode={shouldExpandNode}
        theme={theme} 
      />);
    }
  }
});