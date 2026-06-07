import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import AppRoutes from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              success: {
                iconTheme: {
                  primary: '#4f46e5',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;

