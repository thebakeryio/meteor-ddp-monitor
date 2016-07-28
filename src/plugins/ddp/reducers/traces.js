import { NEW_TRACE, CLEAR_LOGS } from '../constants/action-types';
import Immutable from 'immutable';


export default function traces(state = Immutable.List(), action){
  switch(action.type){
    case NEW_TRACE:
       return state.push(action.trace);
    case CLEAR_LOGS:
      return Immutable.List();
    default:
      return state;
  }
}