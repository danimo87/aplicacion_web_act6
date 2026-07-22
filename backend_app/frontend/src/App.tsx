import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Libros } from './pages/libros/Libros';
import { Usuarios } from './pages/usuarios/Usuarios';
import { Prestamos } from './pages/prestamos/Prestamos';
import { Reservas } from './pages/reservas/Reservas';
import { Reportes } from './pages/reportes/Reportes';
import { Sistema } from './pages/sistema/Sistema';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/libros"
            element={
              <ProtectedRoute>
                <Layout>
                  <Libros />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Layout>
                  <Usuarios />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/prestamos"
            element={
              <ProtectedRoute>
                <Layout>
                  <Prestamos />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reservas"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reservas />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reportes />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/sistema"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Layout>
                  <Sistema />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;