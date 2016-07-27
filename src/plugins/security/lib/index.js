import _ from 'underscore';

module.exports = {

  buildDDPMessage(collection, operation){
    // use empty object for inserts to avoid inserting
    let params = [{}];
    // but _id must be defined for updates and removals  
    if(operation !== 'insert'){
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

  buildDDPMethodTester(method, paramType){
    let params = ['String'];
    if(paramType === 'number'){
      params = [3.14159];
    }
    if(paramType === 'object'){
      params = [{}];      
    }

    const ddpMessage = {
      msg: 'method',
      method: method,
      params: params,
      id: `/audit/${method}/${paramType}`
    };
    return ddpMessage;
  }
};