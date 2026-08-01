import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trades from './pages/Trades';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PersistLogin from './components/PersistLogin';
import CreateTrade from './pages/CreateTrade'
import EditTrade from "./pages/EditTrade";
import TradeDetails from './pages/TradeDetails'
import Analytics from './pages/Analytics';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from "./components/Layout";
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<PersistLogin />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/change-password"
              element={<ChangePassword />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/trades"
              element={<Trades />}
            />

            <Route
              path="/trades/:id"
              element={<TradeDetails />}
            />

            <Route
              path="/create-trade"
              element={<CreateTrade />}
            />

            <Route
              path="/edit-trade/:id"
              element={<EditTrade />}
            />

          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
