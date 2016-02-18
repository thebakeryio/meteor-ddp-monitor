import _ from 'underscore';

const _labels = {
  added : (message) => {
    return _.isArray(message) ?
      `${message.length} items added to ${message[0].collection} collection` :
      `item added to ${message.collection} collection`;
  },

  removed : (message) => {
    return _.isArray(message) ?
      `${message.length} items removed from ${message[0].collection} collection` :
      `item removed from ${message.collection} collection`;
  },

  changed : (message) => {
    return _.isArray(message) ?
      `${message.length} items changed ${message[0].collection} collection` :
      `item changed in ${message.collection} collection`;
  },

  ping : () => 'ping',
  pong : () => 'pong',
  connect : () => 'connect',
  updated : () => 'updated',

  result : (message, traces) => {
    let method = _.find(traces, (t) => {
      return t.operation === 'method' &&
        message.id === t.message.id;
    });
    let methodName = method && method.message.method;
    return `got result for method ${methodName}`;
  },

  sub : (message) => {
    let params = (message.params || []).join(', ')
    if (params) {
      return `subscribing to ${message.name} with ${params}`;
    }
    return `subscribing to ${message.name}`;

  },

  ready : (message, traces) => {
    let sub = _.find(traces, (t) => {
      return t.operation === 'sub' &&
        _.contains(message.subs, t.message.id);
    });
    let subName = (sub && sub.message.name) || 'unknown subscription';
    return `subscription ready for ${subName}`;
  },

  method : (message) => {
    let params = (message.params || []).join(', ')
    if (params) {
      return `calling method ${message.method} with ${params}`;
    }
    return `calling method ${message.method}`;
  },

  unsub : (message, traces) => {
    let sub = _.find(traces, (t) => {
      return t.operation === 'sub' &&
        (message.id === t.message.id);
    });
    let subName = (sub && sub.message.name) || 'unknown subscription';

    return `unsubscribing from ${subName}`;
  },

  nosub : (message, traces) => {
    let sub = _.find(traces, (t) => {
      return t.operation === 'sub' &&
        (message.id === t.message.id);
    });
    let subName = (sub && sub.message.name);
    let label = 'nosub';

    let unsub = _.find(traces, (t) => {
      return t.operation === 'unsub' &&
        (message.id === t.message.id);
    });

    if (subName) {
      label = `unsubscribed from ${subName}`;
    }
    if (! unsub) {
      // no unsubscribe request, hence the subscription is unknown
      label = `${label} (unrecognized subscription)`;
    }
    return label;
  },

};

class TraceLabels {
  run(traces) {
    return _.map(traces, (t) => {
      let messageType = _.isArray(t.message) ?
        t.message[0].msg : t.message.msg;
      let label = _labels[messageType] ?
        _labels[messageType].call(this,t.message,traces) :
        messageType;

      return _.extend(t, { label });
    });
  }
};

export default TraceLabels;
