import { 
  SET_PACKAGE_LIST, 
  SET_COLLECTION_SECURITY,
  SET_SECURITY_TAB
} from '../constants';

export function setPackageList(data) {
  return { 
    type: SET_PACKAGE_LIST,
    data: data
  }
}

export function setCollectionSecurity(collection, isSecure) {
  return {
    type: SET_COLLECTION_SECURITY,
    collection: collection,
    isSecure: isSecure 
  }
}

export function setSecurityTab(tab) {
  return {
    type: SET_SECURITY_TAB,
    tab: tab
  }
}