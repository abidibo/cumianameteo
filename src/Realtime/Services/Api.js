import config from '@Config';
import { api } from '@Core/Services/Api';

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    currentData: builder.query({
      query: () => ({
        url: `realtime/data/${config.station.slug}`,
      }),
      providesTags: ['RealtimeCurrentData'],
    }),
    todayData: builder.query({
      query: () => ({
        url: `realtime/today/data/${config.station.slug}`,
      }),
      providesTags: ['RealtimeTodayData'],
    }),
    historyData: builder.query({
      query: ({ from, to }) => ({
        url: `realtime/${config.station.slug}/history/?from=${from}&to=${to}`,
      }),
      providesTags: ['HistoryData'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCurrentDataQuery,
  useTodayDataQuery,
  useHistoryDataQuery,
} = extendedApi
