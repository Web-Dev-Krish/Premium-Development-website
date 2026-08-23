import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PageSkeleton from './components/PageSkeleton';
import ChatWidget from './components/ChatWidget';
import { ChatProvider } from './lib/chat';
import './index.css';

const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const RecentWork = lazy(() => import('./pages/RecentWork'));
const Contact = lazy(() => import('./pages/Contact'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={
              <Suspense fallback={<PageSkeleton />}>
                <Portfolio />
              </Suspense>
            } />
            <Route path="/recent-work" element={
              <Suspense fallback={<PageSkeleton />}>
                <RecentWork />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageSkeleton />}>
                <Contact />
              </Suspense>
            } />
            <Route path="/services/:slug" element={
              <Suspense fallback={<PageSkeleton />}>
                <ServiceDetail />
              </Suspense>
            } />
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
          <ChatWidget />
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
