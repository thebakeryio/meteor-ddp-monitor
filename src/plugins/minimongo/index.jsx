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
import './minimongo.scss';

let dispatch = null;

const onNewMessage = (error, message) => {
  if(message && message.eventType === 'minimongo-explorer') {
    dispatch(setCollectionData(message.data));
  }
};

class App extends Component {

  componentDidMount() {
    dispatch = this.props.dispatch;

    if(chrome && chrome.devtools) {
      Bridge.registerMessageCallback(onNewMessage);
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

    Analytics.trackPageView('minimongo explorer');
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
      const queryResult = this.props.getItemsForCollection()
        .filter(matcher.action)
        .map(projector.action)
        .sort(sorter.action);

      return (
        <div>
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
        <aside>
          <div className="minimongo-header">Collections</div>
          <CollectionList 
          changeCollectionSelection={changeSelection} 
          collections={this.props.getCollections()}
          currentSelection={this.props.minimongoCurrentSelection}
          />
        </aside>
        <section>
          { this._collectionPanel(this.props.minimongoCurrentSelection) }
        </section> 
      </div>
    )
  }
}

App.propTypes = {
  getCollections : PropTypes.func.isRequired,
  getItemsForCollection : PropTypes.func.isRequired,
  minimongoCurrentSelection : PropTypes.string,
  minimongoCollectionQuery: PropTypes.object,
  minimongoCollections: PropTypes.object
}

export default connect((state) => {
  return {
    minimongoCollections: state.minimongoCollectionData,
    minimongoCurrentSelection: state.minimongoCollectionSelection,
    minimongoCollectionQuery: state.minimongoCollectionQuery,
    getCollections: () => {
      return state.minimongoCollectionData.map((value, key) => {
        return {
          'name': key,
          'size': value.count()
        }
      }).sort((a, b) =>  a.name < b.name ? -1 : 1);
    },
    getItemsForCollection: () => {
      const collection = state.minimongoCollectionSelection;
      const data = state.minimongoCollectionData.toJS();
      return data[collection] || [];
    },
  };
})(App)