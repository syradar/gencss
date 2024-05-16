/**
 * Utility function to trace values in a functional pipeline.
 * @param {Function} fn - The function to call with the current value.
 * @returns {Function} - A function that takes a value, calls `fn` with it, and returns the value.
 */
export function trace(fn) {
  return (val) => {
    fn(val)
    return val
  }
}
