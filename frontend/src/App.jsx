import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "context/AuthContext";
import { Toaster } from "react-hot-toast";
import { CourtProvider } from "context/CourtContext";
import { OwnerProvider } from "context/OwnerContext";
import { AdminProvider } from "context/AdminContext";

function App() {
  return (
    <AuthProvider>
      <CourtProvider>
        <OwnerProvider>
          <AdminProvider>
            <Routes />
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                  background: "#fff",
                  color: "#363636",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  padding: "16px",
                  fontSize: "14px",
                  maxWidth: "400px",
                },

                // Success toast styling
                success: {
                  duration: 3000,
                  style: {
                    background: "#10B981",
                    color: "#fff",
                  },
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#10B981",
                  },
                },

                // Error toast styling
                error: {
                  duration: 5000,
                  style: {
                    background: "#EF4444",
                    color: "#fff",
                  },
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#EF4444",
                  },
                },

                // Loading toast styling
                loading: {
                  style: {
                    background: "#3B82F6",
                    color: "#fff",
                  },
                },

                // Custom toast styling
                custom: {
                  duration: 4000,
                },
              }}
            />
          </AdminProvider>
        </OwnerProvider>
      </CourtProvider>
    </AuthProvider>
  );
}

export default App;
