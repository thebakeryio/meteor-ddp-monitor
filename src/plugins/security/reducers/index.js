import { 
  SET_PACKAGE_LIST,
  SET_COLLECTION_SECURITY,
  SET_SECURITY_TAB,
  CLEAR_COLLECTION_SECURITY
} from '../constants'
import {
  NEW_TRACE
} from '../../ddp/constants/action-types';
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
  securityTabsIndex (state = 0, action) {
    switch(action.type){
      case SET_SECURITY_TAB:
        return action.tab;
      default:
        return state;
    }
  },
  methodsSecurity (state = Immutable.Map(), action) {
    switch(action.type){
      case NEW_TRACE:
        if(action.trace && action.trace.message && action.trace.message.msg === 'method' &&
          !action.trace.message.id.startsWith('/audit')){
          return state.set(action.trace.message.method, action.trace.message.params);
        } else {
          return state;
        }
      default:
        return state;
    }
  }
};