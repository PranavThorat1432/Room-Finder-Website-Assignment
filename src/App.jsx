import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Fragment, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import AuthProvider from './context/AuthContext';
import Header from './components/layout/Header';


const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./Pages/auth/Login'));
const Signup = lazy(() => import('./Pages/auth/Signup'));
const MyListings = lazy(() => import('./pages/owner/MyListings'));
const AddRoom = lazy(() => import('./pages/AddRoom'));
const EditRoom = lazy(() => import('./pages/EditRoom'));
const RoomDetails = lazy(() => import('./pages/RoomDetails'));


const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children || <Outlet /> : <Navigate to="/login" replace />;
};


const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main className="flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingSpinner />}>
          {children || <Outlet />}
        </Suspense>
      </div>
    </main>
  </div>
);


const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="text-center text-3xl font-extrabold text-gray-900">
        RoomFinder
      </h1>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthLayout>
                <Signup />
              </AuthLayout>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />

          </Route>
          
          {/* Public room details route (accessible without login) */}
          <Route 
            path="/rooms/:id" 
            element={
              <MainLayout>
                <RoomDetails />
              </MainLayout>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;