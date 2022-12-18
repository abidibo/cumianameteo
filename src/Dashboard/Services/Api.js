import { api } from '@Core/Services/Api';

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({}),
  overrideExisting: false,
})

export const {
  useWebcamImagesUrlQuery,
} = extendedApi
