import { createStore, applyMiddleware } from 'redux';
import reducer from './ducks/users';
import promiseMiddleware from 'redux-promise-middleware';

export default createStore(reducer, applyMiddleware( promiseMiddleware() )); 
// Without middleware, Redux store only supports synchronous data flow. This is what you get by default with createStore(). A Promise middleware can intercept Promises and dispatch a pair of begin/end actions asynchronously in response to each Promise.
// Asynchronous middleware wraps the store's dispatch() method and allows you to dispatch something other than actions, for example, functions or Promises. Any middleware you use can then interpret anything you dispatch, and in turn, can pass actions to the next middleware in the chain.
// When the last middleware in the chain dispatches an action, it has to be a plain object.
// applymiddleware helps with the promisemiddleware, so you place promisemiddleware inside of applymiddleware.
// Redux promise middleware enables handling of async code in Redux.