import { api } from '@Core/Services/Api';

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    currentData: builder.query({
      query: () => ({
        url: `realtime/data/cumiana`,
      }),
      providesTags: ['RealtimeCurrentData'],
    }),
    todayData: builder.query({
      query: () => ({
        url: `realtime/today/data/cumiana`,
      }),
      providesTags: ['RealtimeTodayData'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCurrentDataQuery,
  useTodayDataQuery,
} = extendedApi
