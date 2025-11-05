// SOLUTION: CollectionPage Component
// This component wraps BookCollection and handles book selection navigation

import { useNavigate } from 'react-router-dom'
import BookCollection from '../components/BookCollection'

function CollectionPage() {
  /* 
    SOLUTION: Consistent Navigation Pattern
    - Same navigation pattern used across all page components
    - useNavigate hook for programmatic navigation
    - Dynamic routes for individual book details
  */
  const navigate = useNavigate()

  /* 
    SOLUTION: Book Selection from Collection
    - When user clicks "View Details" on a book in their collection
    - Navigate to the book's detail page using its ID
    - URL becomes /book/:id where :id is the specific book's identifier
  */
  const handleBookSelect = (book) => {
    navigate(`/book/${book.id}`)
  }

  return (
    <div className="collection-page">
      {/* 
        SOLUTION: Component Composition
        - BookCollection component handles all collection logic
        - Page component only handles navigation concerns
        - Clean separation of responsibilities
      */}
      <BookCollection onBookSelect={handleBookSelect} />
    </div>
  )
}

export default CollectionPage

/* 
  SOLUTION NOTES:
  
  1. Consistent Patterns:
     - All page components follow similar structure
     - useNavigate hook for programmatic navigation
     - handleBookSelect for dynamic route navigation
     
  2. URL Structure:
     - /collection shows all user's books
     - /book/:id shows specific book details
     - Clear hierarchical navigation pattern
     
  3. Component Reusability:
     - BookCollection component unchanged from starter
     - Could be used in different routing contexts
     - Page components provide routing adapter layer
     
  4. User Experience:
     - URLs are bookmarkable and shareable
     - Browser back button works intuitively
     - Deep linking to specific books works
*/