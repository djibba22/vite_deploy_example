// SOLUTION: Navigation with React Router Links
// This component demonstrates converting button-based navigation to Link components

import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  /* 
    SOLUTION: useLocation Hook
    - useLocation returns the current location object
    - location.pathname gives us the current URL path
    - We use this to determine which navigation link should be "active"
    - This replaces the currentView prop from the starter version
  */
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>CodeCaddy</h2>
      </div>
      
      <div className="nav-links">
        {/* 
          SOLUTION: Link Components Replace Buttons
          - Link components create proper anchor tags with href attributes
          - 'to' prop specifies the destination route
          - Conditional className for active state based on current location
          - No onClick handlers needed - React Router handles navigation
        */}
        
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Home
        </Link>
        
        <Link 
          to="/search" 
          className={location.pathname === '/search' ? 'nav-link active' : 'nav-link'}
        >
          Search
        </Link>
        
        <Link 
          to="/collection" 
          className={location.pathname === '/collection' ? 'nav-link active' : 'nav-link'}
        >
          My Collection
        </Link>
      </div>
    </nav>
  )
}

export default Navigation

/* 
  SOLUTION NOTES:
  
  1. Key Changes from Starter:
     - Removed currentView and onNavigate props
     - Replaced button elements with Link components
     - Added useLocation hook to track current route
     - Active state now based on URL instead of state variable
     
  2. Link Component Benefits:
     - Creates proper anchor tags with href attributes
     - Supports right-click "Open in new tab"
     - Better accessibility and SEO
     - Handles browser back/forward automatically
     
  3. Active State Logic:
     - useLocation().pathname gives current URL path
     - Compare with route paths to determine active link
     - Apply 'active' class conditionally
     
  4. Alternative Approaches:
     - NavLink component (has built-in active state handling)
     - Custom hook for active link logic
     - CSS :target selector (less robust)
     
  Example NavLink alternative:
  <NavLink 
    to="/" 
    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
  >
    Home
  </NavLink>
*/