// SOLUTION: Complete BookCollectionContext with Google Books API Integration
// This file demonstrates adding the missing interfaces and implementing real API calls

import { createContext, useContext, useReducer, useEffect } from 'react'
import { searchBooks as searchGoogleBooks } from '../services/googleBooksApi'

/* 
  SOLUTION: Missing Interfaces Implementation
  These interfaces were missing from the starter version and provide
  better code organization and documentation
*/

// SOLUTION: BookCollectionState Interface
// Defines the shape of the context state
// This interface documents what data is available in the context
const BookCollectionStateInterface = {
  books: [], // Array of all books in the collection
  isLoading: false, // Loading state for async operations
  error: null, // Error message if operations fail
  searchResults: [], // Results from book search
  currentlyReading: [], // Books with 'currently-reading' status
  wantToRead: [], // Books with 'want-to-read' status
  haveRead: [] // Books with 'read' status
}

// SOLUTION: BookCollectionActions Interface  
// Defines the available actions/methods in the context
// This interface documents what functions consumers can call
const BookCollectionActionsInterface = {
  addBook: () => {}, // (book: Book) => void
  removeBook: () => {}, // (bookId: string) => void
  updateBookStatus: () => {}, // (bookId: string, status: BookStatus) => void
  searchBooks: () => {}, // (query: string) => Promise<void>
  clearSearch: () => {} // () => void
}

// SOLUTION: BookCollectionHelpers Interface
// Defines helper/utility functions available in the context
// These functions provide convenient ways to access and compute data
const BookCollectionHelpersInterface = {
  getBookById: () => {}, // (id: string) => Book | undefined
  getBooksByStatus: () => {}, // (status: BookStatus) => Book[]
  getTotalBooks: () => {}, // () => number
  getReadingProgress: () => {} // () => { completed: number; total: number }
}

// Sample books for demonstration
const sampleBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    authors: ['F. Scott Fitzgerald'],
    description: 'A classic American novel',
    publishedDate: '1925',
    pageCount: 180,
    imageLinks: {
      thumbnail: 'https://via.placeholder.com/128x192/4a90e2/ffffff?text=Book'
    }
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird', 
    authors: ['Harper Lee'],
    description: 'A story of racial injustice and childhood innocence',
    publishedDate: '1960',
    pageCount: 281,
    imageLinks: {
      thumbnail: 'https://via.placeholder.com/128x192/7ed321/ffffff?text=Book'
    }
  }
]

// Create context
const BookCollectionContext = createContext()

// SOLUTION: Enhanced Reducer with Better Action Handling
function bookCollectionReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null // Clear error when starting new operation
      }
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
      
    case 'ADD_BOOK':
      // Check if book already exists to prevent duplicates
      const bookExists = state.books.some(book => book.id === action.payload.id)
      if (bookExists) {
        return {
          ...state,
          error: 'Book already exists in collection'
        }
      }
      return {
        ...state,
        books: [...state.books, { ...action.payload, status: 'want-to-read' }],
        error: null
      }
      
    case 'REMOVE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload)
      }
      
    case 'UPDATE_BOOK_STATUS':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id
            ? { ...book, status: action.payload.status }
            : book
        )
      }
      
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        isLoading: false,
        error: null
      }
      
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchResults: []
      }
      
    default:
      return state
  }
}

// SOLUTION: Enhanced Initial State
const initialState = {
  books: sampleBooks.map(book => ({ ...book, status: 'want-to-read' })),
  isLoading: false,
  error: null,
  searchResults: []
}

export function BookCollectionProvider({ children }) {
  const [state, dispatch] = useReducer(bookCollectionReducer, initialState)

  // SOLUTION: Enhanced Actions with Error Handling
  const addBook = (book) => {
    try {
      dispatch({ type: 'ADD_BOOK', payload: book })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add book' })
    }
  }

  const removeBook = (bookId) => {
    try {
      dispatch({ type: 'REMOVE_BOOK', payload: bookId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove book' })
    }
  }

  const updateBookStatus = (bookId, status) => {
    try {
      dispatch({ type: 'UPDATE_BOOK_STATUS', payload: { id: bookId, status } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update book status' })
    }
  }

  // SOLUTION: Real Google Books API Search with Error Handling
  const searchBooks = async (query) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      console.log('Searching Google Books for:', query)
      
      // Call real Google Books API
      const result = await searchGoogleBooks(query, {
        maxResults: 20,
        orderBy: 'relevance',
        langRestrict: 'en'
      })
      
      console.log('Google Books API results:', result)
      
      // Transform API results to include default status
      const booksWithStatus = result.items.map(book => ({
        ...book,
        status: 'want-to-read' // Default status for search results
      }))
      
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: booksWithStatus })
      
    } catch (error) {
      console.error('Search error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' })
  }

  /* 
    SOLUTION: Missing Helper Functions Implementation
    These functions were referenced in the interfaces but not implemented
  */
  
  // Find a book by its ID
  const getBookById = (id) => {
    return state.books.find(book => book.id === id)
  }

  // Get all books with a specific status
  const getBooksByStatus = (status) => {
    return state.books.filter(book => book.status === status)
  }

  // Get total number of books in collection
  const getTotalBooks = () => {
    return state.books.length
  }

  // Calculate reading progress statistics
  const getReadingProgress = () => {
    const completed = getBooksByStatus('read').length
    const total = getTotalBooks()
    return { completed, total }
  }

  // SOLUTION: Complete Context Value with All Interfaces
  const value = {
    // State (BookCollectionState interface)
    books: state.books,
    isLoading: state.isLoading,
    error: state.error,
    searchResults: state.searchResults,
    
    // Computed state for convenience
    currentlyReading: getBooksByStatus('currently-reading'),
    wantToRead: getBooksByStatus('want-to-read'),
    haveRead: getBooksByStatus('read'),
    
    // Actions (BookCollectionActions interface)
    addBook,
    removeBook,
    updateBookStatus,
    searchBooks,
    clearSearch,
    
    // Helpers (BookCollectionHelpers interface)
    getBookById,
    getBooksByStatus,
    getTotalBooks,
    getReadingProgress
  }

  return (
    <BookCollectionContext.Provider value={value}>
      {children}
    </BookCollectionContext.Provider>
  )
}

// SOLUTION: Enhanced Hook with Better Error Handling
export function useBookCollection() {
  const context = useContext(BookCollectionContext)
  if (context === undefined) {
    throw new Error('useBookCollection must be used within a BookCollectionProvider')
  }
  return context
}

/* 
  SOLUTION NOTES:
  
  1. Interface Benefits:
     - Document expected shape of state and functions
     - Provide clear contracts for consumers
     - Make code more maintainable and self-documenting
     - Enable better IDE support and error catching
     
  2. Helper Functions:
     - getBookById: Essential for routing with URL parameters
     - getBooksByStatus: Enables filtering functionality
     - getTotalBooks: Provides collection statistics
     - getReadingProgress: Useful for dashboard/stats display
     
  3. Error Handling:
     - All actions wrapped in try/catch
     - Consistent error state management
     - User-friendly error messages
     
  4. Loading States:
     - SET_LOADING action for async operations
     - UI can show loading indicators
     - Better user experience during API calls
     
  5. Context Structure:
     - State: Raw data and loading/error states
     - Actions: Functions that modify state
     - Helpers: Computed values and utility functions
     - Clear separation of concerns
*/