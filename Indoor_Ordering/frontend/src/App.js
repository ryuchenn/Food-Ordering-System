import './style/global.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { mainRoutes, adminRoutes, userRoutes } from './routes/routes'

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
