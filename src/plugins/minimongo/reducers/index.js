import { 
  SET_MINIMONGO_COLLECTION_DATA,
  SET_MINIMONGO_COLLECTION_SELECTION,
  SET_MINIMONGO_COLLECTION_QUERY,
  SET_MINIMONGO_COLLECTION_AND_QUERY,
} from '../constants'
import Immutable from 'immutable'

export default {
  minimongoCollectionData (state = Immutable.Map(), action) {
    switch(action.type){
      case SET_MINIMONGO_COLLECTION_DATA:
        return Immutable.Map(action.data);
      default:
        return state;
    }
  },
  minimongoCollectionSelection (state = Immutable.fromJS(null), action) {
    switch(action.type){
      case SET_MINIMONGO_COLLECTION_SELECTION:
        return Immutable.fromJS(action.collectionName);
      case SET_MINIMONGO_COLLECTION_AND_QUERY:
        return Immutable.fromJS(action.collectionName);
      default:
        return state;
    }
  },
  minimongoCollectionQuery (state = Immutable.Map(), action) {
    switch(action.type){
      case SET_MINIMONGO_COLLECTION_QUERY:
        return state.set(action.collectionName, action.query);
      case SET_MINIMONGO_COLLECTION_AND_QUERY:
        return state.set(action.collectionName, action.query);
      default:
        return state;
    }
  },
};