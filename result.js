/**
 * Represents a successful result.
 * @template T
 */
class Ok {
  ok = true
  err = false

  /**
   * @param {T} value - The value of the successful result.
   */
  constructor(value) {
    this.value = value
  }

  /**
   * Safely unwraps the value.
   * @returns {T} The unwrapped value.
   */
  safeUnwrap() {
    return this.value
  }

  /**
   * Unwraps the value.
   * @returns {T} The unwrapped value.
   */
  unwrap() {
    return this.value
  }

  /**
   * Maps the value using the provided function.
   * @param {function(T): U} fn - The function to apply to the value.
   * @returns {Ok<U>} A new Ok result with the mapped value.
   * @template U
   */
  map(fn) {
    return new Ok(fn(this.value))
  }

  andThen(fn) {
    return fn(this.value)
  }

  /**
   * Unwraps the value or returns the default value.
   * @param {U} [defaultValue] - The default value to return if this is an Err result.
   * @returns {T} The value.
   * @template U
   */
  unwrapOr(_defaultValue) {
    return this.value
  }

  /**
   * Gets the value.
   * @returns {T} The value.
   */
  get val() {
    return this.value
  }
}

/**
 * Represents an error result.
 * @template E
 */
class Err {
  ok = false
  err = true

  /**
   * @param {E} error - The error of the result.
   */
  constructor(error) {
    this.value = error
  }

  /**
   * Unwraps the value.
   * @throws {Error} An error indicating the unwrap attempt on an Err result.
   */
  unwrap() {
    throw new Error(`Tried to unwrap an Err: ${this.value}`)
  }

  /**
   * Maps the error using the provided function.
   * @param {function(E): U} _fn - The function to apply to the error.
   * @returns {Err<E>} The same Err result.
   * @template U
   */
  map(_fn) {
    return this
  }

  andThen(_fn) {
    return this
  }

  /**
   * Unwraps the error or returns the default value.
   * @param {U} defaultValue - The default value to return.
   * @returns {U} The default value.
   * @template U
   */
  unwrapOr(defaultValue) {
    return defaultValue
  }

  /**
   * Gets the error value.
   * @returns {E} The error.
   */
  get val() {
    return this.value
  }
}

/**
 * Factory class for creating Result instances.
 */
class Result {
  /**
   * Creates an Ok result.
   * @param {T} value - The value of the Ok result.
   * @returns {Ok<T>} An Ok result.
   * @template T
   */
  static Ok(value) {
    return new Ok(value)
  }

  /**
   * Creates an Err result.
   * @param {E} error - The error of the Err result.
   * @returns {Err<E>} An Err result.
   * @template E
   */
  static Err(error) {
    return new Err(error)
  }
}

export default Result
