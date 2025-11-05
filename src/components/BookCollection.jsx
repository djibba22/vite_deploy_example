// SOLUTION: Enhanced BookCollection Component
// This component demonstrates routing integration with collection management

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookCollection } from '../context/BookCollectionContext'

function BookCollection({ onBookSelect }) {
  const { 
    books, 
    removeBook, 
    updateBookStatus, 
    getBooksByStatus,
    getTotalBooks,
    error 
  } = useBookCollection()
  
  const [filterStatus, setFilterStatus] = useState('all')
  
  /* 
    SOLUTION: Navigation Integration
    - Can navigate to individual book pages
    - Could add bulk actions with navigation
  */
  const navigate = useNavigate()

  // SOLUTION: Enhanced Filtering Logic
  const filteredBooks = filterStatus === 'all' 
    ? books 
    : getBooksByStatus(filterStatus)

  const handleStatusChange = (bookId, newStatus) => {
    updateBookStatus(bookId, newStatus)
  }

  const handleRemoveBook = (bookId) => {
    if (window.confirm('Are you sure you want to remove this book from your collection?')) {
      removeBook(bookId)
    }
  }

  /* 
    SOLUTION: Alternative Navigation Methods
    - onBookSelect prop for parent-controlled navigation
    - Direct navigation for self-contained component
  */
  const handleViewDetails = (book) => {
    if (onBookSelect) {
      onBookSelect(book) // Use parent's navigation logic
    } else {
      navigate(`/book/${book.id}`) // Navigate directly
    }
  }

  return (
    <div className="book-collection">
      <div className="collection-header">
        <h2>My Book Collection ({getTotalBooks()} books)</h2>
        
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by status:</label>
          <select 
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Books ({getTotalBooks()})</option>
            <option value="want-to-read">
              Want to Read ({getBooksByStatus('want-to-read').length})
            </option>
            <option value="currently-reading">
              Currently Reading ({getBooksByStatus('currently-reading').length})
            </option>
            <option value="read">
              Read ({getBooksByStatus('read').length})
            </option>
          </select>
        </div>
      </div>

      {/* SOLUTION: Error Display */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* SOLUTION: Enhanced Empty State */}
      {filteredBooks.length === 0 ? (
        <div className="empty-collection">
          {filterStatus === 'all' ? (
            <>
              <p>No books in your collection yet.</p>
              <button 
                onClick={() => navigate('/search')}
                className="btn-primary"
              >
                Search for Books
              </button>
            </>
          ) : (
            <p>No books with status "{filterStatus}" found.</p>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img 
                src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192/cccccc/ffffff?text=No+Image'} 
                alt={book.title}
                className="book-cover"
              />
              <div className="book-info">
                <h4>{book.title}</h4>
                <p className="book-authors">
                  {book.authors?.join(', ') || 'Unknown Author'}
                </p>
                <p className="book-year">{book.publishedDate}</p>
                
                <div className="book-status">
                  <label htmlFor={`status-${book.id}`}>Status:</label>
                  <select 
                    id={`status-${book.id}`}
                    value={book.status || 'want-to-read'}
                    onChange={(e) => handleStatusChange(book.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="currently-reading">Currently Reading</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                
                <div className="book-actions">
                  <button 
                    onClick={() => handleViewDetails(book)}
                    className="btn-secondary"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleRemoveBook(book.id)}
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookCollection