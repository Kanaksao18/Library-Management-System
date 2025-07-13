import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import BookManagement from "./Pages/BookManagement";
import AddBook from "./Pages/AddBook";
import Members from "./Pages/Members";
import Borrowing from "./Pages/Borrowing";
import ReportsDashboard from "./Pages/ReportsDashboard";
// import other pages as you create them

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user && user.role === "ADMIN" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
    <Router>
        <Navbar />
      <Routes>
          <Route path="/" element={<BookManagement />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-book" element={<AdminRoute><AddBook /></AdminRoute>} />
          <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="/borrowing" element={<ProtectedRoute><Borrowing/></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsDashboard/></ProtectedRoute>} />
          {/* Add other routes here */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
