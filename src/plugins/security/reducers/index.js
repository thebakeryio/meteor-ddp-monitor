import { 
  SET_PACKAGE_LIST,
  SET_SECURITY_TAB,
  CLEAR_METHOD_SECURITY
} from '../constants'
import {
  NEW_TRACE, CLEAR_LOGS
} from '../../ddp/constants/action-types';
import Immutable from 'immutable'


export default {
  packageList (state = Immutable.List(), action) {
    switch(action.type){
      case SET_PACKAGE_LIST:
        return Immutable.List(action.data);
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
        if(action.trace.message && action.trace.message.msg === 'method' &&
          !action.trace.message.id.startsWith('/audit')){
          return state.set(action.trace.message.method, action.trace.message.params);
        } else {
          return state;
        }
      case CLEAR_METHOD_SECURITY:
        return Immutable.Map();
      default:
        return state;
    }
  },
  resultTraces (state = Immutable.List(), action) {
    switch(action.type){
      case NEW_TRACE:
        if(action.trace.message && action.trace.message.msg === 'result'){
         return state.push(action.trace);
        } else {
          return state;
        }
      case CLEAR_LOGS:
        return Immutable.List();
      default:
        return state;
    }
  }
};