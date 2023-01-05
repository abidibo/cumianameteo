import { Route, Routes } from 'react-router-dom'
import { HistoryRouter as Router } from 'redux-first-history/rr6'
import { history } from '@Core/Redux/Store'
import config from '@Config'

// views
import DashboardView from '@Dashboard/Views/DashboardView'
import ForecastView from '@Foreacast/Views/ForecastView'
import DataHistoryView from '@Realtime/Views/DataHistoryView'

/**
 * Main application router
 * Each route element can be one of the following options:
 * - a view component
 * - a (sub)router defining other routes
 */
const AppRouter = () => {
  return (
    <Router history={history}>
      <Routes>
        <Route exact path={config.urls.home} element={<DashboardView />} />
        <Route exact path={config.urls.forecast} element={<ForecastView />} />
        <Route exact path={config.urls.dataHistory} element={<DataHistoryView />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
