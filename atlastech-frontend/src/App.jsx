import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'
import ChatbotWidget from './components/ChatbotWidget'
import Login from './pages/admin/Login'

function AppContent() {
  const location = useLocation();
  const showChatbot = !location.pathname.startsWith('/admin/login');

  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
      {showChatbot && <ChatbotWidget />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CustomerAuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '14px',
            padding: '12px 16px',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
