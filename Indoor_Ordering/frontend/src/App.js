import './style/global.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { mainRoutes, adminRoutes, userRoutes } from './routes/routes'
import { AuthProvider } from './utils/auth/AuthContext';

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            {mainRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
            {adminRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
            {userRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
            <Route path="*" element={<Navigate to="/error404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>

    </div>
  );
}

export default App;
