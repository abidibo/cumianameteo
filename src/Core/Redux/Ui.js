import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'ui',
  initialState: {
    breadcrumbs: [],
  },
  reducers: {
    setBreadcrumbs: (state, { payload }) => {
      state.breadcrumbs = payload
    },
  },
})

export const {
  setBreadcrumbs,
} = slice.actions

export default slice.reducer

export const selectBreadcrumbs = (state) => state.ui.breadcrumbs
