import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'underscore';
import NodeType from './node-prop-type';

const Node = React.createClass({
  selectedNodeStyle : {
    backgroundColor: 'rgb(56,121,217)'
  },

  hoveredNodeStyle : {
    backgroundColor: 'rgba(56,121,217,0.1)'
  },

  getPaddingStyle () {
    return {paddingLeft: `${3*this.props.depth}px`};
  },

  getStyles (openingTag) {
    return {
      display: this.props.node.get('isExpanded') ? 'block' : 'inline-block' 
    };
  },

  shouldComponentUpdate (nextProps) {
    return nextProps !== this.props;
  },

  isSelected () {
    return this.props.node.get('isSelected');
  },

  isHovered () {
    return this.props.node.get('isHovered');
  },

  isExpanded () {
    return this.props.node.get('isExpanded');
  },

  selectedNodeClassName () {
    return this.isSelected() ? 'selected-node' : '';
  },

  nodeOpeningTagContent () {
    return `${this.props.node.get('name')}`;
  },

  nodeClosingTagContent () {
    return `/${this.props.node.get('name')}`;
  },

  onHover (isHovered) {
    this.props.onHover(this.props.node.get('_id'), isHovered);
  },

  changeSelection () {
    this.props.changeBlazeNodeSelection(this.props.node.get('_id'));
  },

  renderEmptyNode () {
    let styles = this.getPaddingStyle();
    if (this.isSelected()) {
      styles = _.extend({}, styles, this.selectedNodeStyle);
    } else {
      if (this.isHovered()) {
        styles = _.extend({}, styles, this.hoveredNodeStyle);
      }  
    }
    
    return (
      <div style={styles} onMouseOver={() => this.onHover(true)}
        onMouseOut={() => this.onHover(false)}>
        <div className="tag-wrap" style={this.getStyles(true)} onClick={this.changeSelection}>
          &lt;<span className={`tag-name ${this.selectedNodeClassName()}`}>
            {this.nodeOpeningTagContent()}</span>&gt;
        </div>
        <div className="tag-wrap-closing" style={this.getStyles(false)} onClick={this.changeSelection}>
          &lt;<span className={`tag-name ${this.selectedNodeClassName()}`}>
            {this.nodeClosingTagContent()}</span>&gt;
        </div>
      </div>
    );
  },

  render () {
    const toggleCollapse = (e) => {
      e.stopPropagation();
      this.props.onToggleCollapse(this.props.node.get('_id'));

      // XX: unhover all the children because they seem to have hover
      // stuck to them
      const kids = this.props.getChildNodes(this.props.node.get('_id'));
      kids.forEach((child) => {
        this.props.onHover(child.get('_id'), false);
      });
    }
    
    const childNodes = this.props.getChildNodes(this.props.node.get('_id'));
    const hasChildren = childNodes.length !== 0;
    const expansionToggler = (
      <span onClick={toggleCollapse}>
        { this.isExpanded() ?
        <span className="collapse-toggler">&#9660;</span> :
        <span className="collapse-toggler">&#9654;</span> }
      </span>
    );

    // empty node
    if (!hasChildren) {
      return this.renderEmptyNode();
    } else {
      let tagWrapperStyle = this.getPaddingStyle();
      let openingTagStyles = this.getStyles(true);

      if (this.isSelected()) {
        if (!this.isExpanded()) {
          tagWrapperStyle = _.extend({}, tagWrapperStyle, this.selectedNodeStyle);
        } else {
          openingTagStyles = _.extend({}, openingTagStyles, this.selectedNodeStyle);
        }
      } else {
        if (this.isHovered()) {
          if (this.isExpanded()) {
            openingTagStyles = _.extend({}, openingTagStyles, this.hoveredNodeStyle);
          } else {
            tagWrapperStyle = _.extend({}, tagWrapperStyle, this.hoveredNodeStyle);
          }
        }
      }

      return (
        <div style={tagWrapperStyle} onMouseOver={() => {
          // XX: only handle this if the node is collapsed
          !this.isExpanded() && this.onHover(true);
        }} onMouseOut={() => {
          // XX: only handle this if the node is collapsed
          !this.isExpanded() && this.onHover(false);
        }}>
          <div className="tag-wrap" style={openingTagStyles} 
          onMouseOver={() => this.onHover(true)} onMouseOut={() => this.onHover(false)}
          onClick={this.changeSelection} onDoubleClick={toggleCollapse}>
            {expansionToggler}
            &lt;<span className={`tag-name ${this.selectedNodeClassName()}`}>
              {this.nodeOpeningTagContent()}</span>&gt;
          </div>
            { 
              this.isExpanded() ? childNodes.map(node => (
                <Node key={node.get('_id')} node={node} depth={this.props.depth+1}
                  getChildNodes={this.props.getChildNodes}
                  changeBlazeNodeSelection={this.props.changeBlazeNodeSelection}
                  onToggleCollapse={this.props.onToggleCollapse}
                  onHover={this.props.onHover} />
              )) : <span>&#8230;</span>
            }
          <div className={this.isExpanded() ? 'tag-wrap' : 'tag-wrap-closing'}  style={this.getStyles(false)}
            onClick={() => !this.isExpanded() && this.changeSelection() }
            onDoubleClick={(e) => !this.isExpanded() && toggleCollapse(e) }>
            &lt;<span className={`tag-name ${!this.isExpanded() ? this.selectedNodeClassName() : ''}`}>
              {this.nodeClosingTagContent()}</span>&gt;
          </div>
        </div> 
      );
    }
  }
});

export default Node;