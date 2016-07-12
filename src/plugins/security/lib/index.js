import _ from 'underscore';

module.exports = {

  buildDDPMessage(collection, operation){
    const ddpMessage = {
      msg: 'method',
      method: `/${collection}/${operation}`,
      params:[{}],
      id: `/${collection}/${operation}`
    };
    return JSON.stringify(ddpMessage);
  },

  testCollectionSecurity(collection, operation, traces){
    const ddpResponse = _.first(_.filter(traces, function(obj) {
      return (obj.message.id === `/${collection}/${operation}`)
        && (obj.message.msg === 'result');
    }));

    const responseCode = ddpResponse &&
     ddpResponse.message &&
     ddpResponse.message.error &&
     ddpResponse.message.error.error;

    if (!responseCode) {
      return;
    } else {
      return responseCode === 403 ? 'secure' : 'insecure';
    }
  }
};