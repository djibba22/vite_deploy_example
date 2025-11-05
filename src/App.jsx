// SOLUTION: React Router Implementation
// This file demonstrates the complete implementation of React Router
// replacing the conditional rendering approach from the starter version

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage' 
import CollectionPage from './pages/CollectionPage'
import BookDetailsPage from './pages/BookDetailsPage'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* 
        SOLUTION: BrowserRouter Setup
        - BrowserRouter enables client-side routing using HTML5 history API
        - It should wrap the entire application that needs routing
        - This replaces the useState-based navigation from starter version
      */}
      <BrowserRouter basename="/vite_deploy_example/">
        {/* 
          Navigation component is placed outside Routes so it appears on all pages
          The Navigation component will use Link components instead of buttons
        */}
        <Navigation />
        
        <main className="main-content">
          {/* 
            SOLUTION: Routes and Route Configuration
            - Routes container holds all individual Route components
            - Each Route maps a URL path to a React component
            - The 'element' prop specifies which component to render
            - ':id' in the path creates a dynamic parameter accessible via useParams
          */}
          <Routes>
            {/* Home route - matches exactly '/' */}
            <Route path="/" element={<HomePage />} />
            
            {/* Search route - for book searching functionality */}
            <Route path="/search" element={<SearchPage />} />
            
            {/* Collection route - displays user's book collection */}
            <Route path="/collection" element={<CollectionPage />} />
            
            {/* 
              Dynamic route for individual book details
              :id is a parameter that can be accessed with useParams hook
              Example URLs: /book/1, /book/abc123, etc.
            */}
            <Route path="/book/:id" element={<BookDetailsPage />} />
            
            {/* 
              BONUS: 404 Route (catch-all)
              The '*' path matches any route that hasn't been matched above
              This is useful for handling invalid URLs
            */}
            <Route path="*" element={
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App

/* 
  SOLUTION NOTES:
  
  1. Router Structure:
     - BrowserRouter wraps the entire app
     - Navigation outside Routes (appears on all pages)
     - Routes contains all individual Route definitions
     
  2. Route Patterns:
     - Static routes: /, /search, /collection
     - Dynamic routes: /book/:id (id is a parameter)
     - Catch-all: * (handles 404s)
     
  3. Benefits over Conditional Rendering:
     - URLs actually change (bookmarkable, shareable)
     - Browser back/forward buttons work
     - Better SEO and user experience
     - Separation of navigation logic from component logic
     
  4. Key Differences from Starter:
     - No useState for currentView
     - No switch statement for rendering
     - No onNavigate prop passing
     - No selectedBook state (handled by URL params)
*/