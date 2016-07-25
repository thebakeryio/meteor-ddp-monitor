import { 
  SET_TAB_INDEX, 
  MINIMONGO_TAB_INDEX,
  DDP_TAB_INDEX,
  BLAZE_TAB_INDEX,
  SECURITY_TAB_INDEX
} from './constants'
import { 
  SET_MINIMONGO_COLLECTION_SELECTION,
  SET_MINIMONGO_COLLECTION_AND_QUERY
} from '../plugins/minimongo/constants'
import Analytics from './analytics';

const trackRoute = (index) => {
  if (index === DDP_TAB_INDEX){
    Analytics.trackPageView('meteor ddp monitor');
  }
  if(index === BLAZE_TAB_INDEX){
    Analytics.trackPageView('blaze inspector');
  }
  if(index === MINIMONGO_TAB_INDEX){
    Analytics.trackPageView('minimongo explorer');
  }
  if(index === SECURITY_TAB_INDEX){
    Analytics.trackPageView('security auditor');
  }
};

export default {
  tabIndex (state = 0, action) {
    switch(action.type){
      case SET_TAB_INDEX:
        trackRoute(action.index);
        return action.index;
      case SET_MINIMONGO_COLLECTION_SELECTION:
        return MINIMONGO_TAB_INDEX;
      case SET_MINIMONGO_COLLECTION_AND_QUERY:
        return MINIMONGO_TAB_INDEX;
      default:
        return state;
    }
  },
};