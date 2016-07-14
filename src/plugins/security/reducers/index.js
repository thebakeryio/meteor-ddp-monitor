import { 
  SET_PACKAGE_LIST,
  SET_COLLECTION_SECURITY,
  SET_SECURITY_TAB,
  CLEAR_COLLECTION_SECURITY
} from '../constants'
import Immutable from 'immutable'


export default {
  packageList (state = Immutable.fromJS({}), action) {
    switch(action.type){
      case SET_PACKAGE_LIST:
        return Immutable.fromJS(action.data);
      default:
        return state;
    }
  },
  collectionSecurity (state = Immutable.fromJS({}), action) {
    switch(action.type){
      case SET_COLLECTION_SECURITY:
        return state.set(action.method, action.isSecure);
      case CLEAR_COLLECTION_SECURITY:
        return Immutable.fromJS({});
      default:
        return state;
    }
  },
  securityTabsIndex (state = 0, action) {
    switch(action.type){
      case SET_SECURITY_TAB:
        return action.tab;
      default:
        return state;
    }
  }
};