import { isEmpty, isNullish, isString } from "./typeCheck.js"

/**
 * Checks if a string is nullish (null or undefined) or empty.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is nullish or empty, otherwise false.
 */
function isNullishOrEmpty(str) {
  if (isNullish(str)) {
    return true
  }

  if (!isString(str)) {
    return true
  }

  return isEmpty(str)
}

/**
 * Checks if a string is nullish (null or undefined), empty, or consists only of whitespace.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is nullish, empty, or consists only of whitespace, otherwise false.
 */
function isNullishOrEmptyOrWhitespace(str) {
  if (isNullish(str)) {
    return true
  }

  if (!isString(str)) {
    return true
  }

  return isEmpty(str.trim())
}

const Strings = {
  isNullishOrEmpty,
  isNullishOrEmptyOrWhitespace,
}

export default Strings
