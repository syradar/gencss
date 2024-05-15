/**
 * @namespace TypeCheck
 */

/**
 * Checks if a value is null or undefined.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is null or undefined, otherwise false.
 */
export function isNullish(value) {
  return value === null || value === undefined
}

/**
 * Checks if a value is a string.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a string, otherwise false.
 */
export function isString(value) {
  return typeof value === "string"
}

/**
 * Checks if a value is a number and not NaN.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a number and not NaN, otherwise false.
 */
export function isNumber(value) {
  return typeof value === "number" && !isNaN(value)
}

/**
 * Checks if a value is a boolean.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a boolean, otherwise false.
 */
export function isBoolean(value) {
  return typeof value === "boolean"
}

/**
 * Checks if a value is an object and not null or an array.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an object and not null or an array, otherwise false.
 */
export function isObject(value) {
  return !isNullish(value) && typeof value === "object" && !isArray(value)
}

/**
 * Checks if a value is an array.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an array, otherwise false.
 */
export function isArray(value) {
  return Array.isArray(value)
}

/**
 * Checks if a value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a function, otherwise false.
 */
export function isFunction(value) {
  return typeof value === "function"
}

/**
 * Checks if a value is a valid date.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a valid date, otherwise false.
 */
export function isDate(value) {
  return value instanceof Date && !isNaN(value.getTime())
}

/**
 * Checks if a value is empty.
 * For arrays and strings, it checks if the length is zero.
 * For objects, it checks if there are no enumerable properties.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is empty, otherwise false.
 */
export function isEmpty(value) {
  if (isArray(value) || isString(value)) {
    return value.length === 0
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}

/**
 * Checks if a value is defined (not undefined).
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is defined, otherwise false.
 */
export function isDefined(value) {
  return value !== undefined
}

// Aggregate all functions in a single object for default export
const TypeCheck = {
  isNullish,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isDate,
  isEmpty,
  isDefined,
}

export default TypeCheck
