// SOLUTION: Enhanced BookDetails Component
// This component demonstrates router-aware book details display

import { useNavigate } from 'react-router-dom'
import { useBookCollection } from '../context/BookCollectionContext'

function BookDetails({ book, onBack }) {
  const { updateBookStatus } = useBookCollection()
  const navigate = useNavigate()

  if (!book) {
    return (
      <div className="book-not-found">
        <h2>Book Not Found</h2>
        <p>The requested book could not be found.</p>
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
    SOLUTION: Status Update with Navigation
    - Update book status
    - Optionally navigate after status change
  */
  const handleStatusUpdate = (newStatus) => {
    updateBookStatus(book.id, newStatus)
    // Could navigate back to collection to see updated status
    // navigate('/collection')
  }

  /* 
    SOLUTION: Flexible Back Navigation
    - Use onBack prop if provided (parent-controlled)
    - Fallback to direct navigation
  */
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/collection')
    }
  }

  return (
    <div className="book-details">
      <button onClick={handleBack} className="back-button">
        ← Back to Collection
      </button>
      
      <div className="book-details-content">
        <div className="book-details-image">
          <img 
            src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300/cccccc/ffffff?text=No+Image'} 
            alt={book.title}
            className="book-cover-large"
          />
        </div>
        
        <div className="book-details-info">
          <h1>{book.title}</h1>
          <p className="book-authors">
            by {book.authors?.join(', ') || 'Unknown Author'}
          </p>
          
          <div className="book-meta">
            <p><strong>Published:</strong> {book.publishedDate || 'Unknown'}</p>
            <p><strong>Pages:</strong> {book.pageCount || 'Unknown'}</p>
            {book.publisher && <p><strong>Publisher:</strong> {book.publisher}</p>}
            {book.categories && (
              <p><strong>Categories:</strong> {book.categories.join(', ')}</p>
            )}
            <p><strong>Current Status:</strong> 
              <span className={`status-badge status-${book.status}`}>
                {book.status?.replace('-', ' ') || 'Unknown'}
              </span>
            </p>
          </div>
          
          {book.description && (
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          <div className="book-actions">
            {/* SOLUTION: Status Update Actions */}
            <div className="status-actions">
              <h4>Update Status:</h4>
              <div className="status-buttons">
                <button 
                  onClick={() => handleStatusUpdate('want-to-read')}
                  className={book.status === 'want-to-read' ? 'btn-primary' : 'btn-secondary'}
                >
                  Want to Read
                </button>
                <button 
                  onClick={() => handleStatusUpdate('currently-reading')}
                  className={book.status === 'currently-reading' ? 'btn-primary' : 'btn-secondary'}
                >
                  Currently Reading
                </button>
                <button 
                  onClick={() => handleStatusUpdate('read')}
                  className={book.status === 'read' ? 'btn-primary' : 'btn-secondary'}
                >
                  Read
                </button>
              </div>
            </div>
            
            {/* SOLUTION: Additional Actions */}
            <div className="additional-actions">
              <button 
                onClick={() => navigate('/collection')}
                className="btn-secondary"
              >
                Back to Collection
              </button>
              <button 
                onClick={() => navigate('/search')}
                className="btn-secondary"
              >
                Find Similar Books
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails