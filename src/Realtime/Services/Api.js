import { api } from '@Core/Services/Api';

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    currentData: builder.query({
      query: () => ({
        url: `realtime/data/cumiana`,
      }),
      providesTags: ['RealtimeCurrentData'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCurrentDataQuery,
} = extendedApi
