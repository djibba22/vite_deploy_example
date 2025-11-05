// SOLUTION: BookDetailsPage Component
// This component demonstrates useParams for accessing route parameters

import { useParams, useNavigate } from 'react-router-dom'
import { useBookCollection } from '../context/BookCollectionContext'
import BookDetails from '../components/BookDetails'

function BookDetailsPage() {
  /* 
    SOLUTION: useParams Hook
    - useParams extracts parameters from the current route
    - For route /book/:id, useParams() returns { id: "actualValue" }
    - This is how we get the book ID from the URL
  */
  const { id } = useParams()
  
  /* 
    SOLUTION: useNavigate for Back Navigation
    - Provides programmatic navigation for the back button
    - Alternative to browser's back button for controlled navigation
  */
  const navigate = useNavigate()
  
  /* 
    SOLUTION: Context Integration with Routing
    - Use context to find the book by ID from the URL
    - Demonstrates how routing and state management work together
    - getBookById helper function should be implemented in context
  */
  const { getBookById } = useBookCollection()

  // Find the book using the ID from the URL parameter
  const book = getBookById(id)

  /* 
    SOLUTION: Error Handling for Invalid Routes
    - Handle case where book ID doesn't exist
    - Provides feedback instead of crashing
    - Could redirect to 404 page or collection page
  */
  if (!book) {
    return (
      <div className="book-not-found">
        <h2>Book Not Found</h2>
        <p>The book you're looking for doesn't exist in your collection.</p>
        <button 
          onClick={() => navigate('/collection')} 
          className="btn-primary"
        >
          Back to Collection
        </button>
      </div>
    )
  }

  /* 
    SOLUTION: Back Navigation Handler
    - Navigate back to collection when user clicks back
    - Could also use navigate(-1) for browser-like back behavior
    - Provides consistent navigation experience
  */
  const handleBack = () => {
    navigate('/collection')
  }

  return (
    <div className="book-details-page">
      {/* 
        SOLUTION: Component Reuse with Router Context
        - BookDetails component unchanged from starter
        - onBack prop now uses navigate instead of setState
        - Same component works with different navigation approaches
      */}
      <BookDetails book={book} onBack={handleBack} />
    </div>
  )
}

export default BookDetailsPage

/* 
  SOLUTION NOTES:
  
  1. URL Parameters Pattern:
     - Route: /book/:id
     - URL: /book/123
     - useParams(): { id: "123" }
     - Parameter values are always strings
     
  2. Error Handling:
     - Always handle cases where URL parameters don't match data
     - Provide meaningful error messages and navigation options
     - Consider redirecting to appropriate fallback pages
     
  3. Navigation Patterns:
     - navigate('/collection'): Go to specific route
     - navigate(-1): Go back one step in history
     - navigate('/book/456'): Navigate to different book
     
  4. Context Integration:
     - URL parameters drive data lookup
     - Context provides data access methods
     - Routing and state management work together seamlessly
     
  5. Component Composition:
     - Page components handle routing concerns
     - UI components focus on display and interaction
     - Clean separation of responsibilities
*/