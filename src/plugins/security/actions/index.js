import { 
  SET_PACKAGE_LIST, 
  SET_COLLECTION_SECURITY,
  CLEAR_COLLECTION_SECURITY,
  SET_SECURITY_TAB
} from '../constants';

export function setPackageList(data) {
  return { 
    type: SET_PACKAGE_LIST,
    data: data
  }
}

export function setCollectionSecurity(method, isSecure) {
  return {
    type: SET_COLLECTION_SECURITY,
    method: method,
    isSecure: isSecure 
  }
}

export function clearCollectionSecurity() {
  return {
    type: CLEAR_COLLECTION_SECURITY
  }
}

export function setSecurityTab(tab) {
  return {
    type: SET_SECURITY_TAB,
    tab: tab
  }
}