import React from 'react';
import ReactDOM from 'react-dom/client';  // Change from 'react-dom' to 'react-dom/client'
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './store';  // Import the store
import './index.css';
import App from './App';  // Import your root App component
import reportWebVitals from './reportWebVitals';

// Create a root to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));  // Get root element and create root

root.render(
  <Provider store={store}>  {/* Wrap your App with Provider and pass the store */}
    <App />
  </Provider>
);

reportWebVitals();  // Optional: report web vitals for performance monitoring
