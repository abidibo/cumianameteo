import { isRejectedWithValue } from '@reduxjs/toolkit';
import logger from '@Common/Utils/Logger';


// import * as R from 'ramda'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorNotifier = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!
  if (isRejectedWithValue(action)) {
    logger.warning('We got a rejected action!', action)
    const { error, payload, meta, type } = action
    // Do not automatically notify mutation errors.
    // Each mutation error is handled in place.
    // Notify GET errors instead, because GETs are
    // not managed directly (except 404)
    if (!/executeMutation/.test(type) && !status?.payload === 404) {
      console.log(payload, meta, error) // eslint-disable-line
      // @TODO
      // toast.warn(
      //   i18next.t('common:errors.ApiErrorMessage', {
      //     status: payload.originalStatus,
      //     message: error.message,
      //     endpoint: meta.arg.endpointName,
      //   }),
      // )
    }
  }

  return next(action)
}
