// SOLUTION: HomePage Component
// This component replaces the inline home view from the starter's App.jsx

import { useNavigate } from 'react-router-dom'

function HomePage() {
  /* 
    SOLUTION: useNavigate Hook
    - useNavigate returns a function to programmatically navigate
    - Useful for navigation triggered by user actions (button clicks, form submissions)
    - Alternative to Link components for non-anchor navigation
  */
  const navigate = useNavigate()

  return (
    <div className="home-view">
      <h1>Welcome to CodeCaddy</h1>
      <p>Your personal book collection manager</p>
      
      <div className="quick-actions">
        {/* 
          SOLUTION: Programmatic Navigation
          - Using navigate() function instead of setting state
          - These buttons trigger navigation to specific routes
          - Alternative would be Link components styled as buttons
        */}
        <button 
          onClick={() => navigate('/search')} 
          className="btn-primary"
        >
          Search Books
        </button>
        
        <button 
          onClick={() => navigate('/collection')} 
          className="btn-secondary"
        >
          View Collection
        </button>
      </div>
    </div>
  )
}

export default HomePage

/* 
  SOLUTION NOTES:
  
  1. Page Component Pattern:
     - Each route gets its own component
     - Cleaner than inline JSX in switch statements
     - Better code organization and reusability
     
  2. useNavigate vs Link:
     - useNavigate: For programmatic navigation (button clicks, form submissions)
     - Link: For anchor-like navigation (menu items, text links)
     - Both achieve the same result, choose based on UI pattern
     
  3. Component Extraction Benefits:
     - Easier to test individual pages
     - Better code organization
     - Enables code splitting and lazy loading
     - Clear separation of concerns
*/