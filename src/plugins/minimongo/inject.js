const __cleanUpObjectProps = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] instanceof Date) {
      obj[k] = obj[k].toString();
    }
  });
  return obj;
};

const __getMinimongoCollections = (callback) => {
  let data = {};
  const collections = Meteor.connection._mongo_livedata_collections;
  for(let i in collections) {
    if(collections[i].name){
      data[collections[i].name] = collections[i].find().fetch().map(__cleanUpObjectProps);
    } 
  }
  callback && callback('minimongo-explorer', data);
};

let __talkToExtension = null;

module.exports = {
  setup : (talkToExtension) => {
    __talkToExtension = talkToExtension;
    Package.tracker.Tracker.autorun(function(){
      const collections = Meteor.connection._mongo_livedata_collections;
      for(let i in collections) {
        collections[i].find();
      }
      __getMinimongoCollections(talkToExtension)
    });
  },
  onMessage: (message) => {
    if(message.source !== 'minimongo-explorer'){
      return;
    }
    if(message.event === 'get-minimongo-collections'){
      __talkToExtension && __getMinimongoCollections(__talkToExtension);
    }
  }
};
