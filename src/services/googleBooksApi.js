// SOLUTION: Google Books API Service
// Complete implementation with error handling, caching, and data transformation

/**
 * Google Books API Configuration
 * Base URL for Google Books API v1
 */
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

/**
 * Get API key from environment variables
 * In development, this comes from .env file
 * In production, this should be set in deployment environment
 */
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

/**
 * SOLUTION: Book Data Transformation
 * Google Books API returns data in a specific format that needs to be
 * transformed to match our application's Book interface
 */
function transformGoogleBookToBook(googleBook) {
  const volumeInfo = googleBook.volumeInfo || {}
  const imageLinks = volumeInfo.imageLinks || {}
  
  return {
    id: googleBook.id,
    title: volumeInfo.title || 'Unknown Title',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description || 'No description available',
    publishedDate: volumeInfo.publishedDate || 'Unknown',
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    publisher: volumeInfo.publisher || 'Unknown Publisher',
    language: volumeInfo.language || 'en',
    imageLinks: {
      thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || null,
      small: imageLinks.small || imageLinks.thumbnail || null,
      medium: imageLinks.medium || imageLinks.small || null,
      large: imageLinks.large || imageLinks.medium || null
    },
    // Additional metadata
    industryIdentifiers: volumeInfo.industryIdentifiers || [],
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0,
    maturityRating: volumeInfo.maturityRating || 'NOT_MATURE',
    // Google Books specific fields
    googleBooksId: googleBook.id,
    selfLink: googleBook.selfLink,
    previewLink: volumeInfo.previewLink,
    infoLink: volumeInfo.infoLink,
    canonicalVolumeLink: volumeInfo.canonicalVolumeLink
  }
}

/**
 * SOLUTION: API Request Builder
 * Constructs Google Books API URLs with proper parameters
 */
function buildSearchUrl(query, options = {}) {
  const {
    startIndex = 0,
    maxResults = 20,
    orderBy = 'relevance',
    langRestrict = 'en',
    printType = 'books'
  } = options

  const params = new URLSearchParams({
    q: query,
    startIndex: startIndex.toString(),
    maxResults: Math.min(maxResults, 40).toString(), // Google Books max is 40
    orderBy,
    langRestrict,
    printType
  })

  // Add API key if available
  if (API_KEY) {
    params.append('key', API_KEY)
  }

  return `${GOOGLE_BOOKS_BASE_URL}?${params.toString()}`
}

/**
 * SOLUTION: Error Handling Utility
 * Provides user-friendly error messages for different API error scenarios
 */
function handleApiError(error, context = 'API request') {
  console.error(`Google Books API Error (${context}):`, error)

  if (error.name === 'AbortError') {
    return new Error('Request was cancelled')
  }

  if (!navigator.onLine) {
    return new Error('No internet connection. Please check your network and try again.')
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        return new Error('Invalid search query. Please try different search terms.')
      case 401:
        return new Error('API key is invalid or missing. Please check your configuration.')
      case 403:
        return new Error('API quota exceeded. Please try again later.')
      case 404:
        return new Error('No books found for your search.')
      case 429:
        return new Error('Too many requests. Please wait a moment and try again.')
      case 500:
      case 502:
      case 503:
        return new Error('Google Books service is temporarily unavailable. Please try again later.')
      default:
        return new Error(`API error (${error.status}). Please try again.`)
    }
  }

  return new Error('Failed to connect to Google Books. Please check your internet connection and try again.')
}

/**
 * SOLUTION: Request Cache
 * Simple in-memory cache to avoid duplicate API requests
 */
class ApiCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    })
  }

  clear() {
    this.cache.clear()
  }
}

// Global cache instance
const apiCache = new ApiCache()

/**
 * SOLUTION: Main Search Function
 * Searches Google Books API with caching, error handling, and data transformation
 */
export async function searchBooks(query, options = {}) {
  // Validate input
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Search query is required')
  }

  const cleanQuery = query.trim()
  const cacheKey = `search:${cleanQuery}:${JSON.stringify(options)}`

  // Check cache first
  const cachedResult = apiCache.get(cacheKey)
  if (cachedResult) {
    console.log('Returning cached result for:', cleanQuery)
    return cachedResult
  }

  try {
    console.log('Fetching from Google Books API:', cleanQuery)
    
    const url = buildSearchUrl(cleanQuery, options)
    
    // Create AbortController for request timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CodeCaddy/1.0'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`)
      error.status = response.status
      throw error
    }

    const data = await response.json()

    // Transform Google Books response to our format
    const result = {
      items: (data.items || []).map(transformGoogleBookToBook),
      totalItems: data.totalItems || 0,
      query: cleanQuery,
      timestamp: Date.now()
    }

    // Cache the successful result
    apiCache.set(cacheKey, result)

    return result

  } catch (error) {
    throw handleApiError(error, `searching for "${cleanQuery}"`)
  }
}

/**
 * SOLUTION: Get Book Details by ID
 * Fetches detailed information for a specific book
 */
export async function getBookById(bookId) {
  if (!bookId || typeof bookId !== 'string') {
    throw new Error('Book ID is required')
  }

  const cacheKey = `book:${bookId}`
  const cachedResult = apiCache.get(cacheKey)
  if (cachedResult) {
    return cachedResult
  }

  try {
    const params = new URLSearchParams()
    if (API_KEY) {
      params.append('key', API_KEY)
    }

    const url = `${GOOGLE_BOOKS_BASE_URL}/${bookId}?${params.toString()}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CodeCaddy/1.0'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`)
      error.status = response.status
      throw error
    }

    const googleBook = await response.json()
    const book = transformGoogleBookToBook(googleBook)

    apiCache.set(cacheKey, book)
    return book

  } catch (error) {
    throw handleApiError(error, `fetching book "${bookId}"`)
  }
}

/**
 * SOLUTION: Advanced Search Options
 * Provides predefined search filters for common use cases
 */
export const SearchFilters = {
  // Search by specific fields
  byTitle: (title) => `intitle:${title}`,
  byAuthor: (author) => `inauthor:${author}`,
  bySubject: (subject) => `subject:${subject}`,
  byPublisher: (publisher) => `inpublisher:${publisher}`,
  byISBN: (isbn) => `isbn:${isbn}`,

  // Content filters
  freeEbooks: 'filter:free-ebooks',
  paidEbooks: 'filter:paid-ebooks',
  fullViewable: 'filter:full',
  partialViewable: 'filter:partial',

  // Combine multiple filters
  combine: (...filters) => filters.join(' ')
}

/**
 * SOLUTION: Search Suggestions
 * Provides search query suggestions and validation
 */
export function getSearchSuggestions(query) {
  const suggestions = []
  
  if (query.length < 2) {
    return suggestions
  }

  // Add search type suggestions
  suggestions.push(
    `Search for "${query}" in titles`,
    `Search for "${query}" by author`,
    `Search for "${query}" in subjects`
  )

  return suggestions
}

/**
 * SOLUTION: API Health Check
 * Verifies that the Google Books API is accessible
 */
export async function checkApiHealth() {
  try {
    const result = await searchBooks('test', { maxResults: 1 })
    return {
      status: 'healthy',
      message: 'Google Books API is accessible',
      hasApiKey: !!API_KEY,
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      hasApiKey: !!API_KEY,
      timestamp: Date.now()
    }
  }
}

/**
 * SOLUTION: Clear API Cache
 * Utility function to clear the request cache
 */
export function clearApiCache() {
  apiCache.clear()
  console.log('API cache cleared')
}

/**
 * SOLUTION: API Configuration
 * Expose configuration for debugging and monitoring
 */
export const ApiConfig = {
  baseUrl: GOOGLE_BOOKS_BASE_URL,
  hasApiKey: !!API_KEY,
  cacheSize: () => apiCache.cache.size,
  version: '1.0.0'
}

/* 
  SOLUTION NOTES:
  
  1. Complete API Integration:
     - Real Google Books API integration
     - Proper error handling and user feedback
     - Request caching for performance
     - Data transformation for consistent format
     
  2. Error Handling Strategy:
     - Network connectivity checks
     - HTTP status code handling
     - User-friendly error messages
     - Request timeout protection
     
  3. Performance Optimizations:
     - In-memory caching with TTL
     - Request deduplication
     - Configurable request limits
     - Abort controller for timeouts
     
  4. API Key Management:
     - Environment variable configuration
     - Graceful degradation without API key
     - Debug information for troubleshooting
     
  5. Data Transformation:
     - Consistent book object format
     - Handle missing fields gracefully
     - Preserve Google Books metadata
     - Image URL fallback chain
*/