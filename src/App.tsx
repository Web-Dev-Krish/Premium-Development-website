import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import './index.css';

const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-950"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
              <Login />
            </Suspense>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-950"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
                <Admin />
              </Suspense>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
