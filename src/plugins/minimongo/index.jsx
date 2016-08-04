import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Bridge from '../../common/bridge';
import {
  setCollectionData, 
  setCollectionSelection,
  setCollectionQuery
} from './actions';
import Immutable from 'immutable';
import Analytics from '../../common/analytics';
import CollectionList from './components/collection-list';
import CollectionInput from './components/collection-input';
import DataTree from './components/data-tree';
import safeDocumentQuery from './lib/doc-matcher';
import safeDocumentSorter from './lib/doc-sorter';
import safeDocumentProjector from './lib/doc-projector';
import SplitPane from 'react-split-pane';
import './minimongo.scss';

let dispatch = null;

const onNewMessage = (error, message) => {
  if(message && message.eventType === 'minimongo-explorer') {
    dispatch(setCollectionData(message.data));
  }
};

const onPageReload = () => {
  dispatch(setCollectionData());
  Bridge.sendMessageToThePage({
    source: 'security-auditor',
    event: 'get-minimongo-collections'
  });
};

class App extends Component {

  componentDidMount() {
    dispatch = this.props.dispatch;

    if(chrome && chrome.devtools) {
      Bridge.registerMessageCallback(onNewMessage);
      Bridge.registerPageReloadCallback(onPageReload);
      Bridge.sendMessageToThePage({
        source: 'minimongo-explorer',
        event: 'get-minimongo-collections'
      });
    } else {
      var fakeCollections = require('./fake');
      onNewMessage.call(this, null, {
        eventType: 'minimongo-explorer',
        data: fakeCollections
      });
    }
  }

  componentWillUnmount() {
    Bridge.removeMessageCallback(onNewMessage);
  }

  _collectionPanel (currentSelection) {
    if(currentSelection){
      
      const changeQuery = (collectionName, query) => {
        dispatch(setCollectionQuery(collectionName, query));
      }

      const query = this.props.minimongoCollectionQuery.
        get(this.props.minimongoCurrentSelection) || 
        '{ query: { }, fields: { }, sort: { } }';
      const matcher = safeDocumentQuery(query); 
      const projector = safeDocumentProjector(query);
      const sorter = safeDocumentSorter(query);
      const error = matcher.error || projector.error || sorter.error;
      const collection = this.props.minimongoCollections.get(this.props.minimongoCurrentSelection) || [];
      const queryResult = collection.filter(matcher.action).map(projector.action).sort(sorter.action);

      return (
        <div className="collection-panel">
          <div className="minimongo-header">{currentSelection}</div>
          <CollectionInput
            collectionName={currentSelection}
            error={error}
            onChange={changeQuery}
            query={query}
          />
          <DataTree data={queryResult} />
        </div>
      )
    } else {
      return <div className="no-minimongo">No collections yet...</div>
    }
  }

  render() {
    const data = this.props.minimongoCollections;
    const noData = Immutable.is(data, Immutable.fromJS({}));
    const changeSelection = (collectionName) => {
      dispatch(setCollectionSelection(collectionName));
    }

    return (
      <div className="minimongo">
        <SplitPane defaultSize={300} maxSize={400} minSize={100} split="vertical">
          <div>
            <div className="minimongo-header">Collections</div>
            <CollectionList 
            changeCollectionSelection={changeSelection} 
            collections={this.props.minimongoCollections}
            currentSelection={this.props.minimongoCurrentSelection}
            />
          </div>
          <div>
            { this._collectionPanel(this.props.minimongoCurrentSelection) }
          </div>
        </SplitPane>
      </div>
    )
  }
}

App.propTypes = {
  minimongoCurrentSelection : PropTypes.string,
  minimongoCollectionQuery: PropTypes.object,
  minimongoCollections: PropTypes.object.isRequired
}

export default connect((state) => {
  return {
    minimongoCollections: state.minimongoCollectionData,
    minimongoCurrentSelection: state.minimongoCollectionSelection,
    minimongoCollectionQuery: state.minimongoCollectionQuery
  };
})(App)