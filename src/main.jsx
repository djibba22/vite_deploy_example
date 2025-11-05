import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BookCollectionProvider } from './context/BookCollectionContext.jsx'
import './index.css'

/* 
  SOLUTION: Main Entry Point
  - Same as starter version since routing doesn't affect the entry point
  - Context provider wraps the app for state management
  - React Router (BrowserRouter) is inside App.jsx
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BookCollectionProvider>
      <App />
    </BookCollectionProvider>
  </React.StrictMode>,
)