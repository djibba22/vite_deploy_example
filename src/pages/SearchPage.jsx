// SOLUTION: SearchPage Component
// This component wraps the BookSearch component and handles navigation

import { useNavigate } from 'react-router-dom'
import BookSearch from '../components/BookSearch'

function SearchPage() {
  /* 
    SOLUTION: Navigation in Page Components
    - Page components handle navigation logic
    - Components can be reused between different routing approaches
    - Cleaner separation between UI components and routing logic
  */
  const navigate = useNavigate()

  /* 
    SOLUTION: Book Selection Handler
    - When a book is selected from search results, navigate to its detail page
    - Uses dynamic route parameter: /book/:id
    - The book ID becomes a URL parameter accessible via useParams
  */
  const handleBookSelect = (book) => {
    navigate(`/book/${book.id}`)
  }

  return (
    <div className="search-page">
      {/* 
        SOLUTION: Component Reuse
        - BookSearch component remains unchanged from starter
        - Page component handles the routing-specific logic
        - onBookSelect prop provides navigation callback
      */}
      <BookSearch onBookSelect={handleBookSelect} />
    </div>
  )
}

export default SearchPage

/* 
  SOLUTION NOTES:
  
  1. Page vs Component Separation:
     - Pages handle routing and navigation logic
     - Components focus on UI and business logic
     - BookSearch component can be reused in different contexts
     
  2. Dynamic Navigation:
     - navigate(`/book/${book.id}`) creates URLs like /book/123
     - The ID becomes a parameter accessible in BookDetailsPage
     - This pattern enables bookmarkable URLs for specific books
     
  3. Props Pattern:
     - onBookSelect callback allows components to trigger navigation
     - Components don't need to know about routing
     - Page components orchestrate the navigation flow
*/