// SOLUTION: Enhanced BookSearch Component
// This component demonstrates router integration with search functionality

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookCollection } from '../context/BookCollectionContext'

function BookSearch({ onBookSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const { searchResults, searchBooks, addBook, isLoading, error } = useBookCollection()
  
  /* 
    SOLUTION: Navigation Integration
    - useNavigate for programmatic navigation after actions
    - Could navigate to book details after adding to collection
  */
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchBooks(searchTerm)
    }
  }

  /* 
    SOLUTION: Enhanced Add Book with Navigation
    - Add book to collection
    - Provide user feedback
    - Optional: Navigate to collection to see added book
  */
  const handleAddBook = (book) => {
    addBook(book)
    
    // Option 1: Stay on search page with feedback
    alert('Book added to your collection!')
    
    // Option 2: Navigate to collection page to see the book
    // navigate('/collection')
    
    // Option 3: Navigate to the book's detail page
    // navigate(`/book/${book.id}`)
  }

  return (
    <div className="book-search">
      <h2>Search for Books</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="search-input"
          disabled={isLoading} // Disable during loading
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading || !searchTerm.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* SOLUTION: Error Display */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* SOLUTION: Loading State */}
      {isLoading && (
        <div className="loading-message">
          <p>Searching for books...</p>
        </div>
      )}

      <div className="search-results">
        {searchResults.length > 0 && !isLoading && (
          <>
            <h3>Search Results ({searchResults.length})</h3>
            <div className="books-grid">
              {searchResults.map((book) => (
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
                    <div className="book-actions">
                      <button 
                        onClick={() => onBookSelect(book)}
                        className="btn-secondary"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleAddBook(book)}
                        className="btn-primary"
                      >
                        Add to Collection
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BookSearch