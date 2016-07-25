import { TOGGLE_FILTER } from '../constants/action-types'

const initialState = {
  'PingPong' : {
    operations: ['ping','pong'],
    enabled: false
  },
  'Subscriptions' : {
    operations: ['sub','unsub','nosub','ready'],
    enabled: true
  },
  'Collections' : {
    operations: ['added','removed','changed'],
    enabled: true
  },
  'Methods' : {
    operations: ['method','result','updated'],
    enabled: true
  },
  'Connect' : {
    operations: ['connect','connected','failed'],
    enabled: false
  }
};

export default function filters(state = initialState, action){
  switch(action.type){
    case TOGGLE_FILTER:
      return Object.assign({}, state, {
        [action.filter] : Object.assign({}, state[action.filter], {
          enabled : !state[action.filter].enabled
        })
      })
    default:
      return state
  }
}