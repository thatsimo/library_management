import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./pages/login"
import { RegisterPage } from "./pages/register"
import { DashboardPage } from "./pages/dashboard"
import { BookDetailsPage } from "./pages/book-details"
import { NewBookPage } from "./pages/new-book"
import { EditBookPage } from "./pages/edit-book"
import { MyBooksPage } from "./pages/my-books"
import { ProtectedRoute } from "./components/protected-route"

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books/new"
          element={
            <ProtectedRoute>
              <NewBookPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books/:id/edit"
          element={
            <ProtectedRoute>
              <EditBookPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-books"
          element={
            <ProtectedRoute>
              <MyBooksPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

