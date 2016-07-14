import _ from 'underscore';

module.exports = {

  buildDDPMessage(collection, operation){

    let params;

    // use empty object for inserts to avoid inserting
    // but _id must be defined for updates and removals  
    if(operation === 'insert'){
      params = [{}]; 
    } else {
      params = [{
        '_id' : 'an_invalid_id'
      }];
    }

    const ddpMessage = {
      msg: 'method',
      method: `/${collection}/${operation}`,
      params: params,
      id: `/audit/${collection}/${operation}`
    };
    return ddpMessage;
  },

  testCollectionSecurity(collection, operation, traces){
    const ddpResponse = _.first(_.filter(traces, function(obj) {
      return obj && obj.message && (obj.message.id === `/audit/${collection}/${operation}`)
        && (obj.message.msg === 'result');
    }));

    if(!ddpResponse) {
      return;
    }
    
    const result = ddpResponse.result !== undefined;
    const responseCode = ddpResponse.message && ddpResponse.message.error &&
      ddpResponse.message.error.error;

    if (!result && responseCode === 403) {
      return 'secure';
    } else {
      return 'insecure';
    }
  },

  exponentialBackoff(toTry, max, delay, callback) {
    const res = toTry();
    if (res) {
      callback(res);
    } else {
      if (max > 0) {
        setTimeout(() => {
          exponentialBackoff(toTry, max-1, delay * 2, callback);
        }, delay);
      } else {
        console.log('timeout');   
      }
    }
  }
};