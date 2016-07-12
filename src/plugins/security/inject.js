const __getPackageList = (callback) => {
  const collections = Package && Object.keys(Package);
  callback && callback('security-auditor', collections);
};

const __testCollectionSecurity = (ddpMessage) => {
  Meteor.connection._stream.send(ddpMessage);
};

let __talkToExtension = null;

module.exports = {
  setup : (talkToExtension) => {
    __talkToExtension = talkToExtension;
    __getPackageList(talkToExtension);
  },
  onMessage: (message) => {
    if(message.source !== 'security-auditor'){
      return;
    }
    if(message.event === 'get-package-list'){
      __talkToExtension && __getPackageList(__talkToExtension);
    }
    if(message.event === 'test-collection-security') {
      __talkToExtension && __testCollectionSecurity(message.ddpMessage);
    }
  }
};