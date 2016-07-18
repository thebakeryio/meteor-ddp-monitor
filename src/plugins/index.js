import React from 'react';
import { createStore, compose, combineReducers } from 'redux';
import _ from 'underscore';
import DDPReducers from './ddp/reducers';
import DDPMonitor from './ddp';
import BlazeReducers from './blaze/reducers';
import BlazeInspector from './blaze';
import MiniMongoExplorer from './minimongo';
import SecurityAuditor from './security';
import SecurityReducers from './security/reducers';
import MiniMongoReducers from './minimongo/reducers';
import CommonReducers from '../common/reducers';

let __store = null;
const plugins = [
  {
    name: 'DDP Monitor',
    reducers: DDPReducers,
    component: <DDPMonitor />,
  },
  {
    name: 'Blaze Inspector',
    reducers: BlazeReducers,
    component: <BlazeInspector />,
  },
  {
    name: 'MiniMongo Explorer',
    reducers: MiniMongoReducers,
    component: <MiniMongoExplorer />
  },
  {
    name: 'Security Auditor',
    reducers: SecurityReducers,
    component: <SecurityAuditor />
  }
];

module.exports = {
  getStore() {
    if (!__store) {
      const finalCreateStore = compose(
        // XX: work with Redux Devtools Chrome extension
        window.devToolsExtension ? window.devToolsExtension() : f => f
      )(createStore);

      const configureStore = function(initialState){
        let rootReducer = CommonReducers;
        _.each(plugins , (p) => _.extend(rootReducer, p.reducers));
        return finalCreateStore(combineReducers(rootReducer), initialState);
      }

      __store = configureStore();
    }

    return __store;
  },

  getPlugins() {
    return plugins;
  }
};
