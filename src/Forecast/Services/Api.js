import { api } from '@Core/Services/Api';

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    lastForecast: builder.query({
      query: () => ({
        url: `forecast/get-last/`,
      }),
      providesTags: ['Forecast'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useLastForecastQuery,
} = extendedApi
