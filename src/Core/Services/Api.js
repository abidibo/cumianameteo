import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '@Config'
import * as R from 'ramda'

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBasePath,
  prepareHeaders: (headers) => {
    return headers
  },
})

// https://redux-toolkit.js.org/rtk-query/usage/code-splitting
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'RealtimeCurrentData',
    'Forecast',
  ],
  endpoints: () => ({}),
})

export const apiQueryString = (qs) => {
  const items = Object.keys(qs)
    .filter(R.compose(R.not, R.either(R.isEmpty, R.isNil), R.flip(R.prop)(qs)))
    .map((k) => `${k}=${encodeURIComponent(qs[k])}`)

  return items.length ? '&' + items.join('&') : ''
}
