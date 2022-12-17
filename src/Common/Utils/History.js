import { history } from '@Core/Redux/Store'

export const redirectThunk = (url) => () => history.push(url)
