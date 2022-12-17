import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import { rtkQueryErrorNotifier } from './ApiErrorMiddleware'
// api
import { api } from '../Services/Api'
// reducers
import * as R from 'ramda'

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
})

export const reducer = combineReducers({
  router: routerReducer,
  api: api.reducer,
})

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(routerMiddleware, api.middleware, rtkQueryErrorNotifier),
})

export const history = createReduxHistory(store)

export const selectRoutePathname = R.path(['router', 'location', 'pathname'])
