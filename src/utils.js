import clsx from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges Tailwind CSS classes using clsx and tailwind-merge
 * @param {...string} inputs - Class names to be merged
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a currency string
 * @param {number} value - The number to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Formats a date as a string
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  )
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} - Truncated string
 */
export function truncateString(str, length = 50) {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}

/**
 * Debounces a function call
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Generates a random ID
 * @param {number} length - Length of the ID
 * @returns {string} - Random ID
 */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length)
}
