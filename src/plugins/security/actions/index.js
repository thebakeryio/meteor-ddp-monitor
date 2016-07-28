import { 
  SET_PACKAGE_LIST, 
  SET_COLLECTION_SECURITY,
  CLEAR_METHOD_SECURITY,
  SET_SECURITY_TAB
} from '../constants';

export function setPackageList(data) {
  return { 
    type: SET_PACKAGE_LIST,
    data: data
  }
}

export function clearMethodSecurity() {
  return {
    type: CLEAR_METHOD_SECURITY
  }
}

export function setSecurityTab(tab) {
  return {
    type: SET_SECURITY_TAB,
    tab: tab
  }
}