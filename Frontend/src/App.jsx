import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import BackgroundAnimation from './components/BackgroundAnimation';
import Footer from './components/Footer';
import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute';
import ServerWarmup from './components/ServerWarmup';
import SessionCheck from './components/SessionCheck';
import Home from './pages/Home';
import Login from './pages/Login';
import Map from './pages/MapView';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Router>
        <div className="overflow-x-hidden overflow-y-auto">
          <div className="relative z-10 mb-19 flex h-screen flex-col">
            <ServerWarmup>
              <BackgroundAnimation />
              <SessionCheck />
              <Routes>
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      {' '}
                      <Login />{' '}
                    </GuestRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <GuestRoute>
                      {' '}
                      <Signup />{' '}
                    </GuestRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      {' '}
                      <Home />{' '}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map/:id"
                  element={
                    <ProtectedRoute>
                      {' '}
                      <Map />{' '}
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ServerWarmup>
          </div>
          <div className="fixed bottom-0 z-0 h-18 w-full">
            <Footer />
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
